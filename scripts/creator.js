const Handlebars = require('handlebars');
const MovieDataBase = require('./movie-database');
const $ = require('jquery');
const Jimp = require('jimp');
const JsonDataBase = require('./json-database');

const mdb = new MovieDataBase();
const jdb = new JsonDataBase();

class Creator {
  constructor() {
    this.movies = `<div id=movies>
    {{#each items}}
      <div id={{this.id}} class="container">
        <img src=https://image.tmdb.org/t/p/w342{{this.poster_path}}>
      </div>
    {{/ each}}
    </div>
    `;

    this.trailer = `<iframe width="560" height="315" 
    src = "https://www.youtube.com/embed/{{key}}?rel=0&amp;showinfo=0"
    frameborder = "0" allow = "autoplay; encrypted-media"
    allowfullscreen ></iframe >`;

    this.collection = `
    {{#each items}}
    <div id="{{this.id}}" class="movie-reco {{this.classname}}">
      <img src="https://image.tmdb.org/t/p/w342{{this.poster_path}}">
    </div>
    {{/ each}}`;

    this.reco = `
      {{#each items}}
        <div id={{this.id}} class="movie-reco {{this.classname}}">  
          <img src="https://image.tmdb.org/t/p/w342{{this.poster_path}}">
        </div>
      {{/ each}}`;

    this.images = `
    {{#each items}}
      <div class="movie-image">
        <img src="https://image.tmdb.org/t/p/w780{{this.file_path}}"> 
      </div>
    {{/ each}}`;

    this.credits = `{{#each items}}
    <div id="{{this.id}}" class="movie-credit">
      <img src="{{creditImage}}"> 
      <div id="credit-info">
        <p id="credit-job">{{creditJob}}</p>
        <p id="credit-name">{{this.name}}</p>
      </div>
    </div>
    {{/ each}}`;

    this.details = `
    <div id="movie-background" class=parallax-container>
      <h1 id="movie-title">{{title}}</h1>
    </div>
    <div id=movie-details-panel class=content-container>
    <div id="movie-bar">
      <div id="movie-image">
        <img src="https://image.tmdb.org/t/p/w500{{poster}}">
      </div>
      <div id="movie-description">
        <h1 id="movie-title">{{title}}</h1>
        <h2 id="movie-original-title">{{originalTitle}}</h2>
        <p id="date">{{date}}</p>
        <p id="runtime">{{runtime}}</p>
        <p id="overview">{{overview}}</p>
      </div>
    </div>
    <h3>Credits</h3>
    <div id="movie-credits">
    </div>
    <h3>Images</h3>
    <div id="movie-images">
    </div>
    <div id="movie-recommendations">
    </div>
    {{#if hasCollection}}
      <div id="movie-collection">
      </div>
    {{/if}}
    </div>
    `;
  }

  filterCreditsArray(credits) {
    let directors = credits.crew;
    let actors = credits.cast;
    directors = directors.filter(crew => crew.job === 'Director');
    actors = actors.filter((cast, index) => index < 10 - directors.length);
    return directors.concat(actors);
  }

  createCredits(credits) {
    credits = this.filterCreditsArray(credits);
    const source = this.credits;
    const template = Handlebars.compile(source);
    const context = { items: credits };

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
    const result = template(context);

    document.getElementById('movie-credits')
      .insertAdjacentHTML('beforeend', result);
  }

  createMovieDetails(id) {
    mdb.getMovie(id)
      .then((movie) => {
        const source = this.details;
        const template = Handlebars.compile(source);

        const context = {

          poster: movie.poster_path,
          title: movie.title,
          runtime: this.convertRuntime(movie.runtime),
          overview: movie.overview,
          date: parseInt(movie.release_date, 10),
          hasCollection: movie.belongs_to_collection,
        };

        if (movie.original_title !== movie.title) {
          context.originalTitle = `(${movie.original_title}) `;
        }

        const result = template(context);
        document.getElementById('movie-details')
          .insertAdjacentHTML('beforeend', result);

        this.createCredits(movie.credits);
        this.createImages(movie.images.backdrops);
        this.createReco(movie.id, movie.recommendations.results, 18);
        if (movie.belongs_to_collection) {
          this.createCollection(movie.belongs_to_collection.id);
        }
        let backdrop = movie.backdrop_path;
        backdrop = `https://image.tmdb.org/t/p/original${backdrop}`;
        $('#movie-background').css('background-image', `url('${backdrop}')`);
        // return this.blurBase64URI(blurS, 2);
      });
    // .then((blur) => {
    //   $('#movie-background').css('background-image', `url('${blur}')`);
    // });
  }

  createImages(images) {
    images = images
      .sort((a, b) => b.vote_count - a.vote_count);
    images = images.filter((im, i) => i < 3);
    const source = this.images;
    const template = Handlebars.compile(source);
    const context = {
      items: images,
    };

    const result = template(context);
    document.getElementById('movie-images')
      .insertAdjacentHTML('beforeend', result);
  }

  createReco(id, recos, nbrRecos) {
    jdb.readDB('movie')
      .then((movies) => {
        const source = this.reco;
        const template = Handlebars.compile(source);

        recos = recos.map((reco) => {
          if (movies[reco.id] !== undefined) {
            reco.classname = 'badreco';
          } else {
            reco.classname = 'goodreco';
          }
          return reco;
        }).sort((b, a) => {
          if (a.classname < b.classname) return -1;
          if (a.classname > b.classname) return 1;
          return 0;
        }).filter((elem, index) => index < nbrRecos);

        const context = { items: recos };
        const result = template(context);
        const recoSeen = recos.filter(a => a.classname === 'badreco').length;
        const percentSeen = Math.floor((recoSeen / recos.length) * 100);
        const title = `<h3>Similar movies: ${percentSeen}% seen </h3>`;
        document.getElementById('movie-recommendations')
          .insertAdjacentHTML('beforebegin', title);
        document.getElementById('movie-recommendations')
          .insertAdjacentHTML('beforeend', result);
      });

    this.eventReco();
  }

  createCollection(id) {
    mdb.getCollection(id).then((collection) => {
      jdb.readDB('movie')
        .then((movies) => {
          let parts = collection.parts;

          const source = this.collection;
          const template = Handlebars.compile(source);

          parts = parts.map((part) => {
            if (movies[part.id] !== undefined) {
              part.classname = 'badreco';
            } else {
              part.classname = 'goodreco';
            }
            return part;
          }).sort((a, b) => {
            a = parseInt(a.release_date, 10);
            b = parseInt(b.release_date, 10);
            return a < b ? -1 : a > b ? 1 : 0;
          });

          const context = { items: parts };
          const result = template(context);
          const recoSeen = parts.filter(a => a.classname === 'badreco').length;
          const percentSeen = Math.floor((recoSeen / parts.length) * 100);
          const title = `<h3>Collection: ${percentSeen}% seen </h3>`;
          document.getElementById('movie-collection')
            .insertAdjacentHTML('beforebegin', title);
          document.getElementById('movie-collection')
            .insertAdjacentHTML('beforeend', result);
          this.eventCollection();
        });
    });
  }

  createSeen() {
    jdb.readDB('movie')
      .then((data) => {
        const movies = _sortByDate(data);
        const source = this.movies;
        const template = Handlebars.compile(source);
        const context = { items: movies };
        const result = template(context);
        document.getElementById('movies-content')
          .insertAdjacentHTML('beforeend', result);

        this.updateTitle('Collection', movies);

        this.eventClickImage();
      });
  }

  createDiscover(list) {
    return mdb.getDiscover(list, 10)
      .then((movies) => {
        jdb.readDB('movie')
          .then((data) => {
            movies = movies
              .filter(movie => data[movie.id] === undefined);
            const source = this.movies;
            const template = Handlebars.compile(source);
            const context = { items: movies };
            const result = template(context);
            document.getElementById('movies-content')
              .insertAdjacentHTML('beforeend', result);

            this.updateTitle('Discover', movies);

            this.eventClickImage();
          });
      });
  }

  updateTitle(title, movies) {
    const name = `<h1 id=${title.toLowerCase()}>${title}</h1>`;
    const count = `<h2 id="count">${movies.length} movies</h2>`;

    document.getElementById('title')
      .insertAdjacentHTML('beforeend', name);
    document.getElementById('title')
      .insertAdjacentHTML('beforeend', count);
  }

  convertRuntime(mins) {
    const m = mins % 60;
    const h = (mins - m) / 60;
    return `${h.toString()} h ${m < 10 ? '0' : ''}${m.toString()} min`;
  }

  eventCollection() {
    document.getElementById('movie-collection')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        if (event.metaKey || event.ctrlKey) {
          this.eventAddMovieSeen(event);
        } else {
          this.eventMovieDetails(event);
        }
      }, false);
  }
  eventReco() {
    document.getElementById('movie-recommendations')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        if (event.metaKey || event.ctrlKey) {
          this.eventAddMovieSeen(event);
        } else {
          this.eventMovieDetails(event);
        }
      }, false);
  }

  eventClickImage() {
    document.getElementById('movies')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        if (event.metaKey || event.ctrlKey) {
          if ($('#title').html() === 'Discover') {
            this.eventAddMovieSeen(event);
          } else {
            this.eventRemoveMovieSeen(event);
          }
        } else {
          this.eventMovieDetails(event);
        }
      }, false);
  }

  eventAddMovieSeen(event) {
    const element = event.path[1];
    const id = element.id;
    element.classList.toggle('viewed');
    setTimeout(() => {
      const divDelete = (`#${id}`);
      if (element.classList.length === 1) { return; }
      element.classList.toggle('animate');
      setTimeout(() => {
        $(divDelete).remove();

        mdb.getMovie(id, null)
          .then(movie => jdb.addKeyDB('movie', movie));
      }, 250);
    }, 5000);
  }

  eventRemoveMovieSeen(event) {
    const element = event.path[1];
    const id = element.id;
    element.classList.toggle('viewed');
    setTimeout(() => {
      const divDelete = (`#${id}`);
      if (element.classList.length === 1) { return; }
      element.classList.toggle('animate');
      setTimeout(() => {
        $(divDelete).remove();

        jdb.deleteKeyDB('movie', id);
        document.getElementById('count')
          .innerHTML = `${$('div.container').length} movies`;
      }, 250);
    }, 5000);
  }

  eventMovieDetails(event) {
    $('#movie-details').children().remove();

    const element = event.path[1];
    const id = element.id;

    document.getElementById('movies-content').style.display = 'none';

    this.createMovieDetails(id);
  }

  eventNav() {
    document.getElementById('navigation')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') { return; }
        const id = event.target.id;
        if (id === $('#title h1').html().toLowerCase()) {
          $('#movie-details')
            .children()
            .remove();
          document.getElementById('movies-content').style.display = '';
        } else {
          $('#title')
            .children()
            .remove();

          $('#movies')
            .children()
            .remove();

          if (id === 'collection') { this.createSeen(); }

          if (id === 'discover') { this.createDiscover('popular'); }
        }
      });
  }

  blurBase64URI(url, px) {
    return new Promise((resolve) => {
      Jimp.read(url).then((image) => {
        image.blur(px)

          .getBase64(Jimp.AUTO, (err, encoded) => {
            resolve(encoded);
          });
      });
    });
  }
}

module.exports = Creator;

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
