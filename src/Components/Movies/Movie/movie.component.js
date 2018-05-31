angular.module('givka')
  .component('movieComponent', {
    bindings: {
      movie: '<',
    },
    templateUrl: 'Components/Movies/Movie/movie.component.html',
    controller: [class MovieComponent {
      $onChanges() {

      }
    }],

  });
