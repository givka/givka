angular.module('givka')
  .factory('MovieFactory', ($http) => {
    class MovieFactory {
      constructor() {
        this.movie = 'hahahhaha';
      }
      addMovie() {
        const url = 'http://www.google.fr';
        $http.get(url)
          .then((result) => {
            console.log(result);
            this.get = result;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    return MovieFactory;
  });
