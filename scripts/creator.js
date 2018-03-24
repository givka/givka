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

  movie(list) {
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
        const minC = this.minColumn();
        document.getElementsByClassName(`columnId-${minC}`)[0]
          .insertAdjacentHTML('beforeend', result);
      }
    });
  }

  minColumn() {
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

  columns(nbrColumns) {
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

