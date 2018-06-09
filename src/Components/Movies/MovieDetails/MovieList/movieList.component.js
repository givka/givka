angular.module('givka')
  .component('movieListComponent', {
    bindings: {
      movieList: '<',
      listName: '@',
    },
    templateUrl: 'Components/Movies/MovieDetails/MovieList/movieList.component.html',
    controller: [class MovieListComponent {
      $onChanges() {

      }
    }],

  });
