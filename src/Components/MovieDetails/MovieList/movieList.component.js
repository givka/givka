angular.module('givka')
  .component('movieListComponent', {
    bindings: {
      movieList: '<',
      listName: '@',
      showMovieDetailsList: '&',
    },
    templateUrl: 'Components/MovieDetails/MovieList/movieList.component.html',
    controller: [class MovieListComponent {
      $onChanges() {

      }

      onClickPoster(movie) {
        this.showMovieDetailsList({ element: movie });
      }
    }],

  });
