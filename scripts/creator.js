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
    <h1 id = "title" >Movies</h1>
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

        return new Handlebars.SafeString(`${name}`);
      });
      const result = template(context);

      document.getElementById('content')
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
        for (const key in data) {
          console.log(data[key]);

          const source = this.moviePoster;

          const template = Handlebars.compile(source);

          const context = {
            id: data[key].id,
            src: `https://image.tmdb.org/t/p/w342${data[key].poster}`,
          };

          const result = template(context);
          const [minC] = this.getShortestColumn();
          document.getElementsByClassName(`columnId-${minC}`)[0]
            .insertAdjacentHTML('beforeend', result);
        }
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
      this.eventMovieSeen();
    });
  }

  createColumns(nbrColumns) {
    console.log(('entry'));

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
  eventMovieSeen() {
    document.getElementById('movies')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
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
      }, false);
  }

  eventNav() {
    document.getElementById('navigation')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'A') { return; }
        const id = event.target.id;
        const movies = document.getElementById('movies');
        document.getElementById('content').removeChild(movies);
        this.createColumns(9);
        if (id === 'collection') { this.createSeen(); }

        if (id === 'discover') { this.createDiscover('popular'); }
      });
  }
}

module.exports = Creator;

