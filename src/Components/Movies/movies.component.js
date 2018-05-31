angular.module('givka')
  .component('moviesComponent', {
    bindings: {},
    templateUrl: 'Components/Movies/movies.component.html',
    controller: ['TmdbService', class MoviesComponent {
      constructor(TmdbService) {
        this.TmdbService = TmdbService;
        this.list = 'popular';
      }

      $onInit() {
        this.TmdbService.getDiscover(this.list, 10)
          .then((movies) => {
            this.movies = movies;
          });
      }

      onClickPoster(movie) {
        this.movieDetails = movie;
        this.showMovieDetails = true;
      }
    }],

  });
