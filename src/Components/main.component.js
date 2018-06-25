angular.module('givka')
  .component('mainComponent', {
    bindings: {},
    templateUrl: 'Components/main.component.html',
    controller: [class MainComponent {
      constructor() {
        this.moviesType = 'seen';
      }
    }],

  });
