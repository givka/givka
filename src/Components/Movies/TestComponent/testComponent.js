angular.module('givka')
  .component('testComponent', {
    bindings: {},
    templateUrl: 'Components/Movies/TestComponent/testComponent.html',
    controller: ['MovieFactory', 'MovieDBService', class TestComponent {
      constructor(MovieFactory, MovieDBService) {
        this.user = 'lol';
        this.MovieFactory = MovieFactory;
        this.MovieDBService = MovieDBService;

        this.test = new this.MovieFactory();
      }

      $onChanges() {
        this.test = 'haha';
        this.MovieDBService.getMovie(11);
      }
    }],

  });
