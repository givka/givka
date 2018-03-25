const Handlebars = require('handlebars');
const MovieDataBase = require('./movie-database');
const $ = require('jquery');
const Jimp = require('jimp');
const JsonDataBase = require('./json-database');

const mdb = new MovieDataBase();
const jdb = new JsonDataBase();

class Creator {
  constructor() {
    this.column = `<div id="movies">
    <h1 id = "title" >Discover</h1>
    <div id="row">
    {{#each items}}
    <div id="column" class="{{agree_button}}"></div>
    {{/ each}}
    </div>
    </div>`;

    this.moviePoster = `<div id="container" class="{{id}}">
    <img src="{{src}}">
    </div>`;

    this.trailer = `<iframe width="560" height="315" 
    src = "https://www.youtube.com/embed/{{key}}?rel=0&amp;showinfo=0"
    frameborder = "0" allow = "autoplay; encrypted-media"
    allowfullscreen ></iframe >`;

    this.collection = `<div id="collection">
    <div id="description"></div>
    <h1>{{title}}</h1>
    <img src="https://image.tmdb.org/t/p/w500{{image}}">
    <p>{{desc}}</p>
    <div id="parts">
    {{#each items}}
    <img src="https://image.tmdb.org/t/p/w500{{imagePart}}">
    {{/ each}}
    </div>
    </div>`;
    this.details = `<div id="movie-details">
    <div id="movie-background" style="{{style}}"></div>
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
    <div id="movie-others">
      <div id="movie-collection"></div>
    </div>
  </div>`;
  }
  createMovieDetails(id) {
    const source = this.details;
    mdb.getMovie(id).then((movie) => {
      const template = Handlebars.compile(source);
      const context = {
        poster: movie.poster_path,
        title: movie.title,
        runtime: this.convertRuntime(movie.runtime),
        overview: movie.overview,
        date: parseInt(movie.release_date, 10),
      };
      if (movie.original_title !== movie.title) {
        context.originalTitle = `(${movie.original_title}) `;
      }
      if (movie.belongs_to_collection) {
        this.createCollection(movie.belongs_to_collection.id);
      }

      context.style = `background: url(images/fade.png), 
url(https://image.tmdb.org/t/p/original${movie.backdrop_path});
        height: 68vh;
        background-repeat: no-repeat;
        background-size: 100% 150%, cover;
        background-position: 0% 0%,center 0%;`;
      const result = template(context);
      document.getElementById('content')
        .insertAdjacentHTML('beforeend', result);
    });
  }

  createCollection(id) {
    return mdb.getCollection(id).then((collection) => {
      const movies = collection.parts;
      movies.sort((a, b) => {
        a = parseInt(a.release_date, 10);
        b = parseInt(b.release_date, 10);
        return a < b ? -1 : a > b ? 1 : 0;
      });
      const source = this.collection;
      const template = Handlebars.compile(source);
      const context = {
        title: collection.name,
        image: collection.poster_path,
        desc: collection.overview,
        items: movies,
      };
      Handlebars.registerHelper('imagePart', function () {
        const name = Handlebars.escapeExpression(this.poster_path);

        return new Handlebars.SafeString(`${name} `);
      });
      const result = template(context);

      document.getElementById('movie-collection')
        .insertAdjacentHTML('beforeend', result);
    });
  }

  createTrailer(id) {
    return mdb.getMovie(id)
      .then((movie) => {
        let trailer;
        for (const video of movie.videos.results) {
          if (video.type === 'Trailer') {
            trailer = video;
            break;
          }
        }

        const source = this.trailer;
        const template = Handlebars.compile(source);
        const context = {
          key: trailer.key,
        };
        const result = template(context);

        document.getElementById('content')
          .insertAdjacentHTML('beforeend', result);
      });
  }
  createSeen() {
    jdb.readDB('movie')
      .then((data) => {
        const movies = this.sortByDate(data);

        for (const movie of movies) {
          const source = this.moviePoster;

          const template = Handlebars.compile(source);

          const context = {
            id: movie.id,
            src: `https://image.tmdb.org/t/p/w342${movie.poster}`,
          };

          const result = template(context);
          const [minC] = this.getShortestColumn();
          document.getElementsByClassName(`columnId-${minC}`)[0]
            .insertAdjacentHTML('beforeend', result);
        }
        const count = `<h2 id="count">${$('div#container').length} movies</h2>`;
        document.getElementById('title')
          .innerHTML = 'Collection';
        document.getElementById('title')
          .insertAdjacentHTML('afterend', count);
      });
  }

  createDiscover(list) {
    return mdb.getDiscover(list, 10).then((movies) => {
      jdb.readDB('movie')
        .then((data) => {
          for (const movie of movies) {
            if (data[movie.id] !== undefined) {
              continue;
            }
            const source = this.moviePoster;

            const template = Handlebars.compile(source);

            const context = {
              id: movie.id,
              src: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
            };

            const result = template(context);
            const [minC] = this.getShortestColumn();
            document.getElementsByClassName(`columnId-${minC}`)[0]
              .insertAdjacentHTML('beforeend', result);
          }
        });
    });
  }

  createColumns(nbrColumns) {
    const source = this.column;
    const template = Handlebars.compile(source);
    const array = [...Array(nbrColumns).keys()];

    for (const number of array) {
      array[number] = {
        name: number + 1,
      };
    }

    const context = {
      items: array,
    };

    Handlebars.registerHelper('agree_button', function () {
      const name = Handlebars.escapeExpression(this.name);

      return new Handlebars.SafeString(`columnId-${name}`);
    });

    const result = template(context);
    document.getElementById('content').insertAdjacentHTML('afterbegin', result);
    this.eventClickImage();
  }

  getShortestColumn() {
    let min = 1e9;
    let minColumn;
    const nbrColumns = $('#row').children().length;

    for (let c = 1; c <= nbrColumns; c += 1) {
      const columnChildren = $(`.columnId-${c}`).children().length;
      if (min > columnChildren) {
        min = columnChildren;
        minColumn = c;
      }
    }
    return [minColumn, min];
  }

  getLongestColumn() {
    let max = 0;
    let maxColumn;
    const nbrColumns = $('#row').children().length;

    for (let c = 1; c <= nbrColumns; c += 1) {
      const columnChildren = $(`.columnId-${c}`).children().length;
      if (max < columnChildren) {
        max = columnChildren;
        maxColumn = c;
      }
    }
    return [maxColumn, max];
  }

  updateColumn() {
    const [minColumn, minChildren] = this.getShortestColumn();
    const [maxColumn, maxChildren] = this.getLongestColumn();
    if (maxChildren - minChildren < 1) {
      return;
    }
    const toMove = document.querySelector(`.columnId-${maxColumn}`).lastChild;
    if (toMove.classList[1] === 'animate') {
      return;
    }
    toMove.classList.toggle('animate');

    setTimeout(() => {
      document.querySelector(`.columnId-${minColumn}`).appendChild(toMove);
      setTimeout(() => {
        toMove.classList.toggle('animate');
      }, 300);
    }, 300);
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

  convertRuntime(mins) {
    const m = mins % 60;
    const h = (mins - m) / 60;
    return `${h.toString()} h ${m < 10 ? '0' : ''}${m.toString()} min`;
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
    const id = element.classList[0];
    element.classList.toggle('viewed');
    setTimeout(() => {
      const divDelete = (`.${id}`);
      if (element.classList.length === 1) { return; }
      element.classList.toggle('animate');
      setTimeout(() => {
        $(divDelete).remove();
        this.updateColumn();
        mdb.getMovie(id, null)
          .then(movie => jdb.addKeyDB('movie', movie));
      }, 250);
    }, 5000);
  }

  eventRemoveMovieSeen(event) {
    const element = event.path[1];
    const id = element.classList[0];
    element.classList.toggle('viewed');
    setTimeout(() => {
      const divDelete = (`.${id}`);
      if (element.classList.length === 1) { return; }
      element.classList.toggle('animate');
      setTimeout(() => {
        $(divDelete).remove();
        this.updateColumn();
        jdb.deleteKeyDB('movie', id);
        document.getElementById('count')
          .innerHTML = `${$('div#container').length} movies`;
      }, 250);
    }, 5000);
  }
  eventMovieDetails(event) {
    const element = event.path[1];
    const id = element.classList[0];

    document.getElementById('movies').style.display = 'none';
    this.createMovieDetails(id);
  }

  eventNav() {
    document.getElementById('navigation')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') { return; }

        const id = event.target.id;

        if (id === $('#title').html().toLowerCase()) {
          if ($('#movie-details').length > 0) {
            const movieDetails = document.getElementById('movie-details');
            document.getElementById('content').removeChild(movieDetails);
            document.getElementById('movies').style.display = 'block';
          }
        } else {
          if ($('#movie-details').length > 0) {
            const movieDetails = document.getElementById('movie-details');
            document.getElementById('content').removeChild(movieDetails);
          }
          const movies = document.getElementById('movies');
          document.getElementById('content').removeChild(movies);

          this.createColumns(9);

          if (id === 'collection') { this.createSeen(); }

          if (id === 'discover') { this.createDiscover('popular'); }
        }
      });
  }

  sortByDate(obj) {
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
}

module.exports = Creator;

