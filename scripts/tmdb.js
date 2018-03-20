const API_KEY = 'aa79a25e783821b082e1e241e41889db';
const LANGUAGE = 'fr-FR';
const rp = require('request-promise');

class MovieDataBase {
  getCollection(id) {
    const url = `https://api.themoviedb.org/3/collection/${id}`;
    const addRequest = 'images';

    return this.constructor.getRequest(url, addRequest);
  }

  getTV(id) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;
    const addRequest = 'credits,images,videos,recommendations';

    return this.constructor.getRequest(url, addRequest);
  }
  getPeople(id) {
    const url = `https://api.themoviedb.org/3/people/${id}`;
    const addRequest = 'movie_credits,images';

    return this.constructor.getRequest(url, addRequest);
  }
  getMovie(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const addRequest = 'credits,images,videos,recommendations';

    return this.constructor.getRequest(url, addRequest);
  }

  static getRequest(url, addRequestAppend, nbrPage) {
    const options = {
      method: 'GET',
      url,
      qs: {
        language: LANGUAGE,
        api_key: API_KEY,
        append_to_response: addRequestAppend,
        include_image_language: 'en,null',
        page: nbrPage,
      },
      body: '{}',
      json: true,
    };
    return rp(options)
      .then(response => response)
      .catch((err) => {
        throw err;
      });
  }

  getMovies(list, number) {
    const url = `https://api.themoviedb.org/3/movie/${list}`;
    const PromiseArray = [];

    for (let i = 1; i <= number; i += 1) {
      PromiseArray.push(this.constructor.getRequest(url, null, i));
    }
    return Promise.all(PromiseArray)
      .then((allResponses) => {
        let results = allResponses.map(value => value.results);
        results = [].concat(...results);
        return results;
      });
  }
}

module.exports = MovieDataBase;

