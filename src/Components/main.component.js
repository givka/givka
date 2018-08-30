angular.module('givka')
  .component('mainComponent', {
    bindings: {},
    templateUrl: 'Components/main.component.html',
    controller: ['$scope', '$q', 'TmdbService', 'StorageService', class MainComponent {
      constructor($scope, $q, TmdbService, StorageService) {
        this.$scope = $scope;
        this.$q = $q;
        this.TmdbService = TmdbService;

        this.StorageService = StorageService;

        this.type = 'seen';

        this.tabSelected = 'movies';
      }

      onClickTab(tab) {
        this.tabSelected = tab;
      }
    }],

  });
