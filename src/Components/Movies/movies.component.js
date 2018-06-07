angular.module('givka')
  .component('moviesComponent', {
    bindings: {},
    templateUrl: 'Components/Movies/movies.component.html',
    controller: ['TmdbService', 'StorageService', class MoviesComponent {
      constructor(TmdbService, StorageService) {
        this.TmdbService = TmdbService;
        this.StorageService = StorageService;
        this.list = 'popular';

        this.movies = [];
      }

      $onChanges(changes) {
        // this.TmdbService.getDiscover(this.list, 10)
        //   .then((movies) => {
        //     this.movies = movies;
        //     console.log(this.movies);
        //   });

        console.log(changes);

        this.StorageService.readDB('movie')
          .then((movies) => {
            this.movies = Object.keys(movies).map(key => movies[key]);
            console.log(this.movies);
          });
      }

      onClickPoster(movie) {
        this.movieDetails = movie;
        this.showMovieDetails = true;
      }
    }],

  });
