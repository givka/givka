const Handlebars = require('handlebars');
const MovieDataBase = require('./movie-database');
const $ = require('jquery');
const Jimp = require('jimp');

const mdb = new MovieDataBase();

class Creator {
  constructor() {
    this.column = `<h1 id = "title" > Movies</h1>
    <div id="movies">
    <div id="row">
    {{#each items}}
    <div id="column" class="{{agree_button}}"></div>
    {{/ each}}
    </div>
    </div>`;

    this.moviePoster = `<div id="container" class="{{id}}">
    <img src="{{src}}">
    <div class="bottom">{{title}}</div>
    </div>`;

    this.trailer = `<iframe width="560" height="315" 
    src = "https://www.youtube.com/embed/{{key}}?rel=0&amp;showinfo=0"
    frameborder = "0" allow = "autoplay; encrypted-media"
    allowfullscreen ></iframe >`;

    this.collection = `<div id="collection">
    <div id="description"></div>
    <h1>{{title}}</h1>
    <img src="https://image.tmdb.org/t/p/w500{{image}}" alt="">
    <p>{{desc}}</p>
    <div id="parts">
    {{#each items}}
    <img src="https://image.tmdb.org/t/p/w500{{imagePart}}" alt=""">
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

  createMovies(list) {
    return mdb.getMovies(list, 10).then((movies) => {
      for (const movie of movies) {
        const source = this.moviePoster;
        // var divName = document.createElement("div");
        // divName.innerHTML = result.title;
        // divName.className = "bottom"

        const template = Handlebars.compile(source);

        const context = {
          id: movie.id,
          src: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
          // title: movie.title,
        };

        const result = template(context);
        const minC = this.getShortestColumn();
        document.getElementsByClassName(`columnId-${minC}`)[0]
          .insertAdjacentHTML('beforeend', result);
      }
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
    return result;
  }

  getShortestColumn() {
    let min = 1e9;
    let minColumn;
    const nbrColumns = $('#row').children().length;

    for (let c = 1; c <= nbrColumns; c += 1) {
      const columnChildren = $(`.columnId-${c.toString()}`).children().length;
      if (min > columnChildren) {
        min = columnChildren;
        minColumn = c;
      }
    }
    return minColumn;
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
}

module.exports = Creator;

