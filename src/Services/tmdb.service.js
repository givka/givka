angular.module('givka')
  .service('TmdbService', ['$http', '$q', class TmdbService {
    constructor($http, $q) {
      this.$http = $http;
      this.$q = $q;
      this.apiKey = 'aa79a25e783821b082e1e241e41889db';
      this.language = 'en-US';
    }

    getSearchResult(query) {
      const url = `https://api.themoviedb.org/3/search/multi?query=${query}`;
      return this._getRequest(url);
    }

    getCollection(id) {
      const url = `https://api.themoviedb.org/3/collection/${id}`;
      const addRequest = 'images';
      return this._getRequest(url, addRequest);
    }

    getTV(id) {
      const url = `https://api.themoviedb.org/3/tv/${id}`;
      const addRequest = 'credits,images,videos,recommendations';
      return this._getRequest(url, addRequest);
    }

    getPeople(id) {
      const url = `https://api.themoviedb.org/3/person/${id}`;
      const addRequest = 'movie_credits,images,tagged_images';
      return this._getRequest(url, addRequest);
    }

    getMovie(id, addRequest = 'credits,images,videos,recommendations') {
      const url = `https://api.themoviedb.org/3/movie/${id}`;
      return this._getRequest(url, addRequest);
    }

    getDiscover(list, number) {
      const url = `https://api.themoviedb.org/3/movie/${list}`;
      const PromiseArray = [];

      for (let i = 1; i <= number; i += 1) {
        PromiseArray.push(this._getRequest(url, null, i));
      }
      return this.$q.all(PromiseArray)
        .then((allResponses) => {
          let results = allResponses.map(value => value.results);
          results = [].concat(...results);
          return Object.keys(results).map(key => results[key]);
        });
    }

    _getRequest(url, addRequestAppend, nbrPage) {
      return this.$http({
        url,
        method: 'GET',
        params: {
          language: this.language,
          api_key: this.apiKey,
          append_to_response: addRequestAppend,
          include_image_language: 'en,null',
          page: nbrPage,
        },
        body: '{}',
        json: true,
      }).then(result => result.data);
    }
  }]);
