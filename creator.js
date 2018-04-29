const Handlebars = require('handlebars');
const $ = require('jquery');
const Jimp = require('jimp');
const RatingColor = require('./lib/rating-color');
const JsonDB = require('./lib/json-database');
const MovieDB = require('./lib/movie-database');

let _backdrops = {};

class Creator {
  eventList() {
    document
      .getElementById('people-list-content')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        if (event.metaKey || event.ctrlKey) {
          this.eventAddMovieSeen(event);
        } else {
          this.eventMovieDetails(event);
        }
      }, false);
  }

  async createList(id, array, name) {
    const movies = await JsonDB.readDB('movie');

    const template = await _getTemplate('list');

    array = array.map((elem) => {
      if (movies[elem.id] !== undefined) {
        elem.classname = 'badreco';
      } else {
        elem.classname = 'goodreco';
      }
      return elem;
    }).sort((b, a) => {
      a = parseInt(a.release_date, 10);
      b = parseInt(b.release_date, 10);
      return a < b ? -1 : a > b ? 1 : 0;
    }).filter(elem => elem.poster_path);

    const context = { items: array };
    const result = template(context);
    const arraySeen = array.filter(a => a.classname === 'badreco').length;
    const percentSeen = Math.floor((arraySeen / array.length) * 100);
    const title = `<h3>${name}: ${percentSeen}% seen </h3>`;
    document.getElementById('people-list-content')
      .insertAdjacentHTML('beforeend', title);
    document.getElementById('people-list-content')
      .insertAdjacentHTML('beforeend', result);

    this.eventList();
  }

  async createPeople(id) {
    const people = await MovieDB.getPeople(id);

    if (people.movie_credits.cast !== undefined) {
      const castArray = people.movie_credits.cast;

      this.createList(id, castArray, 'Actor');
    }

    const template = await _getTemplate('people');

    const context = {
      poster: people.profile_path,
      name: people.name,
      birthday: people.birthday,
      biography: people.biography,
    };

    const result = template(context);

    document.getElementById('people-content')
      .insertAdjacentHTML('beforeend', result);

    const backdrops = people.tagged_images.results
      .filter(elem => elem.aspect_ratio > 1)
      .sort((a, b) => b.width - a.width);

    const background = backdrops[0].file_path;
    const bI = `https://image.tmdb.org/t/p/original${background}`;
    $('#people-background').css('background-image', `url('${bI}')`);
  }

  async createBackground(id) {
    $('#spinner').css('display', 'block');

    const title = _backdrops[id].title;
    const img = _backdrops[id].backdrop_path;
    const template = await _getTemplate('movie-background');
    const context = { title };
    const result = template(context);

    document.getElementById('movie-content')
      .insertAdjacentHTML('beforeend', result);

    let bgImg = `https://image.tmdb.org/t/p/original${img}`;

    const test = new Image();
    test.onload = function () {
      $('#movie-background').css('background-image', `url('${bgImg}')`);
      bgImg = `https://image.tmdb.org/t/p/w300${img}`;

      _blurBase64URI(bgImg, 20).then((blur) => {
        $('#movie-details-panel').css('background-image', `url(${blur})`);
        $('#spinner').css('display', 'none');
        $('#movie-details').css('display', 'block');
      });
    };
    test.src = bgImg;
  }

  async createMovieDetails(id) {
    this.createBackground(id);
    _backdrops = {};

    const template = await _getTemplate('movie-details');

    const movie = await MovieDB.getMovie(id);

    const [credits,
      director] = _getCredits(movie.credits);
    const images = _getImages(movie.images.backdrops);

    const moviesDB = await JsonDB.readDB('movie');

    const [recommendations, collectionParts, directorMovies] = await Promise.all([
      _getRecommendations(movie.recommendations.results, moviesDB),
      _getCollection(movie.belongs_to_collection, moviesDB),
      _getDirectorMovies(director, moviesDB),
    ]);

    const context = {
      poster: movie.poster_path,
      title: movie.title,
      runtime: _convertRuntime(movie.runtime),
      overview: movie.overview,
      date: parseInt(movie.release_date, 10),
      hasCollection: movie.belongs_to_collection,
      voteCount: movie.vote_count,
      voteAverage: movie.vote_average * 10,
      images,
      credits,
      recommendations,
      collectionParts,
      directorMovies,
    };

    if (movie.original_title !== movie.title) {
      context.originalTitle = `(${movie.original_title}) `;
    }

    const result = template(context);
    document.getElementById('movie-details-panel')
      .insertAdjacentHTML('beforeend', result);

    const vote = movie.vote_average;
    $('#voteaverage').css('background', RatingColor.ratingToColor(vote * 10));

    this.eventPosterMovieDetails();
  }

  async createSeen() {
    const data = await JsonDB.readDB('movie');
    const movies = _sortByDate(data);

    _backdrops = {};
    _fillBackdrops(movies);

    const context = { items: movies };

    const template = await _getTemplate('movies');
    const result = template(context);

    document.getElementById('movies-content')
      .insertAdjacentHTML('beforeend', result);

    this.updateTitle('Collection', movies);
    this.eventClickImage();
  }

  async createDiscover(list) {
    const movies = await MovieDB.getDiscover(list, 10);

    _backdrops = {};
    _fillBackdrops(movies);

    const data = await JsonDB.readDB('movie');
    movies.map((movie) => {
      if (data[movie.id] !== undefined) {
        movie.seen = 'badreco';
      } else {
        movie.seen = '';
      }
      return movie;
    });

    const template = await _getTemplate('movies');
    const context = { items: movies };
    const result = template(context);

    document.getElementById('movies-content')
      .insertAdjacentHTML('beforeend', result);

    this.updateTitle('Discover', movies);
    this.eventClickImage();
  }

  updateTitle(title, movies) {
    const name = `<h1 id=${title.toLowerCase()}>${title}</h1>`;
    const count = `<h2 id="count">${movies.length} movies</h2>`;

    document.getElementById('movies-content')
      .insertAdjacentHTML('afterbegin', name + count);
  }

  eventPosterMovieDetails() {
    document
      .getElementById('movie-details')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        if (event.metaKey || event.ctrlKey) {
          const container = event.path[1];
          if (container.classList.contains('badreco')) {
            this.eventRemoveMovieSeen(container);
          } else {
            this.eventAddMovieSeen(container);
          }
        } else {
          this.eventMovieDetails(event);
        }
      }, false);
  }

  eventClickImage() {
    document
      .getElementById('movies')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        if (event.metaKey || event.ctrlKey) {
          const container = event.path[1];
          if (container.classList.contains('badreco')) {
            this.eventRemoveMovieSeen(container);
          } else {
            this.eventAddMovieSeen(container);
          }
        } else {
          this.eventMovieDetails(event);
        }
      }, false);
  }

  async eventAddMovieSeen(element) {
    const id = element.id.replace('id-', '');
    element.classList.toggle('badreco');
    const movie = await MovieDB.getMovie(id, null);
    await JsonDB.addKeyDB('movie', movie);
  }

  async eventRemoveMovieSeen(element) {
    const id = element.id.replace('id-', '');
    element.classList.toggle('badreco');
    await JsonDB.deleteKeyDB('movie', id);
  }

  eventMovieDetails(event) {
    _empty('#movies-content');
    _empty('#movie-content');

    const element = event.path[1];
    const id = element.id.replace('id-', '');
    this.createMovieDetails(id);
  }

  eventNav() {
    document.getElementById('navigation')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') { return; }
        const id = event.target.id;

        _empty('#movies-content');
        _empty('#movie-content');

        if (id === 'collection') { this.createSeen(); }

        if (id === 'discover') { this.createDiscover('top_rated'); }
      });
  }
}

async function _getDirectorMovies(director, moviesDB) {
  director = await MovieDB.getPeople(director.id);

  let movies = director.movie_credits.crew;
  movies = movies.filter(movie => movie.poster_path);

  movies = movies.filter(movie => movie.job === 'Director');

  movies = movies.map((movie) => {
    if (moviesDB[movie.id] !== undefined) {
      movie.classname = 'badreco';
    }
    const vote = movie.vote_average * 10;
    movie.voteWidth = vote;
    movie.voteColor = RatingColor.ratingToColor(vote);

    return movie;
  });

  movies = _sortByKey(movies, 'vote_count');

  movies.filter(movie => movie.poster_path);

  const moviesSeen = movies.filter(a => a.classname === 'badreco').length;
  const percentSeen = Math.floor((moviesSeen / movies.length) * 100);

  _fillBackdrops(movies);

  return { movies, percentSeen };
}

function _empty(selector) {
  return $(selector)
    .children()
    .remove();
}

function _convertRuntime(mins) {
  const m = mins % 60;
  const h = (mins - m) / 60;
  return `${h.toString()} h ${m < 10 ? '0' : ''}${m.toString()} min`;
}

function _sortByDate(obj) {
  const sort = [];
  for (const key in obj) {
    sort.push(obj[key]);
  }
  sort.sort((a, b) => {
    a = a.date;
    b = b.date;
    return a < b ? -1 : a > b ? 1 : 0;
  });
  return sort;
}

function _blurBase64URI(url, px) {
  return new Promise((resolve) => {
    Jimp.read(url)
      .then((image) => {
        image.color([{ apply: 'shade', params: [50] }])
          .blur(px)
          // .resize(10, 10)
          .getBase64(Jimp.AUTO, (err, encoded) => {
            resolve(encoded);
          });
      });
  });
}

async function _getTemplate(name) {
  if (Handlebars.templates === undefined ||
    Handlebars.templates[name] === undefined) {
    await $.ajax({
      url: `views/${name}.hbs`,
      success(data) {
        if (Handlebars.templates === undefined) {
          Handlebars.templates = {};
        }
        Handlebars.templates[name] = Handlebars.compile(data);
      },
    });
  }

  return Handlebars.templates[name];
}

function _getImages(images) {
  images = _sortByKey(images, 'vote_count');
  images = images.filter((im, i) => i < 6);
  return images;
}

function _sortByKey(array, key) {
  return array.sort((a, b) => b[key] - a[key]);
}

function _getCredits(credits) {
  let directors = credits.crew;
  let actors = credits.cast;
  directors = directors.filter(crew => crew.job === 'Director');
  actors = actors.filter((cast, index) => index < 10 - directors.length);
  credits = directors.concat(actors);

  Handlebars.registerHelper('creditImage', function () {
    let string = null;
    if (this.profile_path === null) {
      string = 'images/no-profile.png';
    } else {
      string = `https://image.tmdb.org/t/p/w185${this.profile_path}`;
    }
    return new Handlebars.SafeString(string);
  });

  Handlebars.registerHelper('creditJob', function () {
    let string = null;
    if (this.job !== undefined) {
      string = this.job;
    } else {
      string = this.character;
    }
    return new Handlebars.SafeString(string);
  });

  return [credits, directors[0]];
}

async function _getRecommendations(movies, moviesDB) {
  movies = movies.filter(movie => movie.poster_path);

  movies = movies.map((reco) => {
    if (moviesDB[reco.id] !== undefined) {
      reco.classname = 'badreco';
    }
    const vote = reco.vote_average * 10;
    reco.voteWidth = vote;
    reco.voteColor = RatingColor.ratingToColor(vote);
    return reco;
  });

  movies = _sortByKey(movies, 'vote_count');

  const recoSeen = movies.filter(a => a.classname === 'badreco').length;
  const percentSeen = Math.floor((recoSeen / movies.length) * 100);

  _fillBackdrops(movies);

  return { movies, percentSeen };
}

async function _getCollection(hasCollection, moviesDB) {
  if (hasCollection === null) { return [null, null]; }
  const id = hasCollection.id;
  const collection = await MovieDB.getCollection(id);

  let movies = collection.parts;

  movies = movies.filter(movie => movie.poster_path);

  movies = movies.map((part) => {
    if (moviesDB[part.id] !== undefined) {
      part.classname = 'badreco';
    }
    const vote = part.vote_average * 10;
    part.voteWidth = vote;
    part.voteColor = RatingColor.ratingToColor(vote);
    return part;
  });

  movies = _sortByKey(movies, 'release_date');

  _fillBackdrops(movies);

  const recoSeen = movies.filter(a => a.classname === 'badreco').length;
  const percentSeen = Math.floor((recoSeen / movies.length) * 100);

  return { movies, percentSeen };
}

function _fillBackdrops(movies) {
  movies.forEach((movie) => {
    const backdrop_path = movie.backdrop_path;
    const title = movie.title;
    _backdrops[movie.id] = { title, backdrop_path };
  });
}

// function _sleep(s) {
//   return new Promise(((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, s * 1000);
//   }));
// }

module.exports = Creator;
