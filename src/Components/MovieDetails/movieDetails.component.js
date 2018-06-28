angular.module('givka')
  .component('movieDetailsComponent', {
    bindings: {
      movie: '<',
      showMovieDetails: '&',
    },
    templateUrl: 'Components/MovieDetails/movieDetails.component.html',
    controller: [class MovieDetailsComponent {
      $onChanges() {

      }

      toggleMovieDetails(movie) {
        this.showMovieDetails({ element: movie });
      }
    }],

  });
