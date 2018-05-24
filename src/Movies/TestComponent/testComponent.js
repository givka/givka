angular.module('givka')
  .component('testComponent', {
    bindings: {

    },

    templateUrl: 'Movies/TestComponent/testComponent.html',
    controller: class TestComponent {
      constructor() {
        this.user = 'lol';


      }
    }
  });