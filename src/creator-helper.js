const Handlebars = require('handlebars');
const Jimp = require('jimp');
const $ = require('jquery');

const RatingColor = require('./../lib/rating-color');
const MovieDB = require('./../lib/movie-database');

class CreatorHelper {
  static getCredits(credits) {
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

  static async getRecommendations(movies, moviesDB) {
    movies = _filterSeen(movies, moviesDB);
    movies = _sortByKey(movies, 'vote_count');

    const recoSeen = movies.filter(a => a.classname === 'badreco').length;
    const percentSeen = Math.floor((recoSeen / movies.length) * 100);

    return { movies, percentSeen };
  }

  static async getCollection(hasCollection, moviesDB) {
    if (hasCollection === null) { return [null, null]; }
    const id = hasCollection.id;
    const collection = await MovieDB.getCollection(id);

    let movies = collection.parts;

    movies = _filterSeen(movies, moviesDB);
    movies = _sortByKey(movies, 'release_date');

    const recoSeen = movies.filter(a => a.classname === 'badreco').length;
    const percentSeen = Math.floor((recoSeen / movies.length) * 100);

    return { movies, percentSeen };
  }

  static getImages(images) {
    images = _sortByKey(images, 'vote_count');
    images = images.filter((im, i) => i < 6);
    return images;
  }

  static async getDirectorMovies(director, moviesDB) {
    director = await MovieDB.getPeople(director.id);

    let movies = director.movie_credits.crew;

    movies = movies.filter(movie => movie.job === 'Director');

    movies = _filterSeen(movies, moviesDB);
    movies = _sortByKey(movies, 'vote_count');

    movies = movies.filter(m => m.vote_count > 50);

    const moviesSeen = movies.filter(a => a.classname === 'badreco').length;
    const percentSeen = Math.floor((moviesSeen / movies.length) * 100);

    return { movies, percentSeen };
  }

  static async setBackground(backdrop) {
    const img = backdrop;

    const bgImg = `https://image.tmdb.org/t/p/w300${img}`;

    const blur = await _blurBase64URI(bgImg, 5);

    while ($('#movie-details').length === 0) {
      const seconds = 1;
      console.log(`waiting for ${seconds}s`);
      await new Promise(resolve => setTimeout(() => resolve(), 1000 * seconds));
    }
    $('#movie-details').css('background-image', `url(${blur})`);

    return blur;
  }

  static async getTemplate(name) {
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
}

function _sortByKey(array, key) {
  return array.sort((a, b) => b[key] - a[key]);
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

function _filterSeen(movies, moviesDB) {
  movies = movies.filter(movie => movie.poster_path);

  return movies.map((movie) => {
    if (moviesDB[movie.id] !== undefined) {
      movie.classname = 'badreco';
    }
    const vote = movie.vote_average * 10;
    movie.voteWidth = vote;
    movie.voteColor = RatingColor.ratingToColor(vote);
    return movie;
  });
}

module.exports = CreatorHelper;

