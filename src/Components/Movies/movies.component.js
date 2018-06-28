angular.module('givka')
  .component('moviesComponent', {
    bindings: {
      type: '<',
      showMovieDetails: '&',
    },
    templateUrl: 'Components/Movies/movies.component.html',
    controller: ['TmdbService', 'StorageService', 'MovieDetailsFactory', class MoviesComponent {
      constructor(TmdbService, StorageService, MovieDetailsFactory) {
        this.TmdbService = TmdbService;
        this.StorageService = StorageService;
        this.MovieDetailsFactory = MovieDetailsFactory;

        this.list = 'popular';
        this.movies = [];
        this.percentSeen = '0%';
      }

      async $onChanges() {
        if (!this.type) { return; }

        this.percentSeen = null;

        await this.StorageService.readDB('movie')
          .then((moviesSeen) => {
            if (this.type === 'seen') {
              this.movies = Object.keys(moviesSeen).map(key => moviesSeen[key]);
              this.movies = _.orderBy(this.movies, e => parseInt(e.release_date, 10));
            }

            if (this.type === 'discover') {
              this.TmdbService.getDiscover('top_rated', 20)
                .then((movies) => {
                  this.movies = movies;
                  this.movies = this._filterSeen(this.movies, moviesSeen);
                  this.percentSeen = this._getPercentSeen(this.movies);
                });
            }
          });
      }

      onClickPoster(movie, event) {
        if (this._toggleSeen(movie, event)) { return; }
        this.showMovieDetails({ element: movie });
      }

      _filterSeen(movies, moviesSeen) {
        return movies.map((movie) => {
          movie.seen = !!moviesSeen[movie.id];
          return movie;
        });
      }

      _toggleSeen(movie, event) {
        if (event.ctrlKey || event.metaKey) {
          movie.seen = !movie.seen;
          if (this.type === 'seen') {
            movie.seen ? this.StorageService.deleteKeyDB('movie', movie) : this.StorageService.addKeyDB('movie', movie);
          }
          else {
            movie.seen ? this.StorageService.addKeyDB('movie', movie) : this.StorageService.deleteKeyDB('movie', movie);
            this.percentSeen = this._getPercentSeen(this.movies);
          }
          return true;
        }
        return false;
      }

      _getPercentSeen(movies) {
        let percentSeen = movies.filter(movie => movie.seen);
        percentSeen = (percentSeen.length / movies.length) * 100;
        return `${percentSeen.toFixed(2)}%`;
      }
    }],

  });
