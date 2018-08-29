angular.module('givka')
  .component('movieListComponent', {
    bindings: {
      movieList: '<',
      listName: '@',

    },
    templateUrl: 'Components/MovieDetails/MovieList/movieList.component.html',
    controller: ['$scope', class MovieListComponent {
      constructor($scope) {
        this.$scope = $scope;
      }
      $onChanges() {

      }

      onClickPoster(movie) {
        this.$scope.$emit('movieDetails', { movie });
      }
    }],

  });
