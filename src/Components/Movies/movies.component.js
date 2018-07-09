angular.module('givka')
  .component('moviesComponent', {
    bindings: {
      movies: '<',
      type: '<',
      showMovieDetails: '&',
    },
    templateUrl: 'Components/Movies/movies.component.html',
    controller: ['TmdbService', 'StorageService', 'MovieDetailsFactory', class MoviesComponent {
      constructor(TmdbService, StorageService, MovieDetailsFactory) {
        this.TmdbService = TmdbService;
        this.StorageService = StorageService;
        this.MovieDetailsFactory = MovieDetailsFactory;
      }

      onClickPoster(movie, event) {
        if (event.ctrlKey || event.metaKey) {
          movie.seen = !movie.seen;
          movie.seen ? this.StorageService.addKeyDB('movie', movie) : this.StorageService.deleteKeyDB('movie', movie);
          this.percentSeen = this._getPercentSeen(this.movies);
        }
        else {
          this.showMovieDetails({ element: movie });
        }
      }

      _getPercentSeen(movies) {
        let percentSeen = movies.filter(movie => movie.seen);
        percentSeen = (percentSeen.length / movies.length) * 100;
        return `${percentSeen.toFixed(2)}%`;
      }
    }],

  });
