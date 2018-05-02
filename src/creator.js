const $ = require('jquery');

const RatingColor = require('./../lib/rating-color');
const JsonDB = require('./../lib/json-database');
const MovieDB = require('./../lib/movie-database');
const CreatorHelper = require('./creator-helper');

let _backdrops = {};

class Creator {
  async createPeopleDetails(id) {
    const template = await CreatorHelper.getTemplate('people-details');
    const people = await MovieDB.getPeople(id);

    const context = {
      people,
    };

    const result = template(context);
    document.getElementById('people-content')
      .insertAdjacentHTML('beforeend', result);
    $('#people-details').css('display', 'block');

    const crew = people.movie_credits.crew
      .filter(e => e.job === 'Director')
      .filter(e => e.vote_count > 50)
      .sort((a, b) => b.vote_count - a.vote_count);

    const cast = people.movie_credits.cast
      .filter(e => e.vote_count > 50)
      .sort((a, b) => b.vote_count - a.vote_count);

    const list2 = { name: 'Actor', percentSeen: 0, movies: cast };
    const list3 = { name: 'Director', percentSeen: 0, movies: crew };

    const context2 = { list: list2 };
    const context3 = { list: list3 };
    const template2 = await CreatorHelper.getTemplate('list');
    const result2 = template2(context2);

    const template3 = await CreatorHelper.getTemplate('list');
    const result3 = template3(context3);

    document.getElementById('people-details-panel')
      .insertAdjacentHTML('beforeend', result2);

    document.getElementById('people-details-panel')
      .insertAdjacentHTML('beforeend', result3);

    _fillBackdrops(list2.movies);

    _fillBackdrops(list3.movies);

    this.eventPosterMovieDetails('people-details');
  }
  async createMovieDetails(id) {
    CreatorHelper.getBackground(id, _backdrops[id]);

    _backdrops = {};

    const template = await CreatorHelper.getTemplate('movie-details');

    const movie = await MovieDB.getMovie(id);

    const [credits,
      director] = CreatorHelper.getCredits(movie.credits);
    const images = CreatorHelper.getImages(movie.images.backdrops);

    const moviesDB = await JsonDB.readDB('movie');

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
    };

    this.createRecommendations(movie, moviesDB);
    this.createDirectorMovies(director, moviesDB);
    this.createCollection(movie, moviesDB);

    if (movie.original_title !== movie.title) {
      context.originalTitle = `(${movie.original_title}) `;
    }

    const result = template(context);
    document.getElementById('movie-details-panel')
      .insertAdjacentHTML('beforeend', result);

    const vote = movie.vote_average;
    $('#voteaverage').css('background', RatingColor.ratingToColor(vote * 10));

    this.eventPosterMovieDetails('movie-details');
  }

  async createRecommendations(movie, moviesDB) {
    const recommendations = await CreatorHelper
      .getRecommendations(movie.recommendations.results, moviesDB);

    recommendations.name = 'Recommendations';
    const context = { list: recommendations };

    const template = await CreatorHelper.getTemplate('list');
    const result = template(context);

    document.getElementById('recommendations')
      .insertAdjacentHTML('beforeend', result);

    _fillBackdrops(recommendations.movies);
  }

  async createDirectorMovies(director, moviesDB) {
    const directorMovies = await CreatorHelper
      .getDirectorMovies(director, moviesDB);
    directorMovies.name = 'Director Movies';
    const context = { list: directorMovies };

    const template = await CreatorHelper.getTemplate('list');
    const result = template(context);

    document.getElementById('director-movies')
      .insertAdjacentHTML('beforeend', result);

    _fillBackdrops(directorMovies.movies);
  }

  async createCollection(movie, moviesDB) {
    if (movie.belongs_to_collection === null) {
      return;
    }
    const collectionParts = await CreatorHelper
      .getCollection(movie.belongs_to_collection, moviesDB);

    collectionParts.name = 'Collection';
    const context = { list: collectionParts };

    const template = await CreatorHelper.getTemplate('list');
    const result = template(context);

    document.getElementById('collection-parts')
      .insertAdjacentHTML('beforeend', result);

    _fillBackdrops(collectionParts.movies);
  }

  async createSeen() {
    const data = await JsonDB.readDB('movie');
    const movies = _sortByDate(data);

    _backdrops = {};
    _fillBackdrops(movies);

    const context = { items: movies };

    const template = await CreatorHelper.getTemplate('movies');
    const result = template(context);

    document.getElementById('movies-content')
      .insertAdjacentHTML('beforeend', result);

    _updateTitle('Collection', movies);
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

    const template = await CreatorHelper.getTemplate('movies');
    const context = { items: movies };
    const result = template(context);

    document.getElementById('movies-content')
      .insertAdjacentHTML('beforeend', result);

    _updateTitle('Discover', movies);
    this.eventClickImage();
  }

  eventPosterMovieDetails(selector) {
    document
      .getElementById(selector)
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        const container = event.path[1];
        if (event.metaKey || event.ctrlKey) {
          if (container.classList.contains('badreco')) {
            this.eventRemoveMovieSeen(container);
          } else {
            this.eventAddMovieSeen(container);
          }
          _updatePercentSeen();
        } else {
          if (container.classList.contains('movie-credit')) {
            this.eventPeopleDetails(event);
          }
          if (container.classList.contains('movie-poster')) {
            this.eventMovieDetails(event);
          }
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
    const id = element.classList[0].replace('id-', '');
    $(`.${element.classList[0]}`).toggleClass('badreco');
    const movie = await MovieDB.getMovie(id, null);
    await JsonDB.addKeyDB('movie', movie);
  }

  async eventRemoveMovieSeen(element) {
    const id = element.classList[0].replace('id-', '');
    $(`.${element.classList[0]}`).toggleClass('badreco');
    await JsonDB.deleteKeyDB('movie', id);
  }

  eventMovieDetails(event) {
    _empty('#movies-content');
    _empty('#movie-content');
    _empty('#people-content');

    const element = event.path[1];
    const id = element.classList[0].replace('id-', '');
    this.createMovieDetails(id);
  }

  eventPeopleDetails(event) {
    _empty('#movies-content');
    _empty('#movie-content');
    _empty('#people-content');

    const element = event.path[1];
    const id = element.classList[0].replace('id-', '');
    this.createPeopleDetails(id);
  }

  eventNav() {
    document.getElementById('navigation')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') { return; }
        const id = event.target.id;

        _empty('#movies-content');
        _empty('#movie-content');
        _empty('#people-content');

        if (id === 'collection') { this.createSeen(); }

        if (id === 'discover') { this.createDiscover('top_rated'); }
      });
  }
}

function _updateTitle(title, movies) {
  const name = `<h1 id=${title.toLowerCase()}>${title}</h1>`;
  const count = `<h2 id="count">${movies.length} movies</h2>`;

  document.getElementById('movies-content')
    .insertAdjacentHTML('afterbegin', name + count);
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

function _fillBackdrops(movies) {
  movies.forEach((movie) => {
    const backdrop_path = movie.backdrop_path;
    const title = movie.title;
    _backdrops[movie.id] = { title, backdrop_path };
  });
}

function _updatePercentSeen() {
  document.querySelectorAll('.list')
    .forEach((list) => {
      const percentSeen = list.parentElement.getElementsByTagName('span')[0];
      const badrecos = list.querySelectorAll('.badreco').length;
      const movies = list.querySelectorAll('.movie-poster').length;
      percentSeen.innerHTML = Math.floor(badrecos / movies * 100);
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
