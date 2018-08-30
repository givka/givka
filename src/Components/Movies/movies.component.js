angular.module('givka')
  .component('moviesComponent', {
    bindings: {
      movies: '<',
    },
    templateUrl: 'Components/Movies/movies.component.html',
    controller: ['$scope', '$q', 'TmdbService', 'StorageService', 'MovieFactory', 'BackgroundFactory', class MoviesComponent {
      constructor($scope, $q, TmdbService, StorageService, MovieFactory, BackgroundFactory) {
        this.$scope = $scope;
        this.$q = $q;
        this.TmdbService = TmdbService;
        this.StorageService = StorageService;
        this.MovieFactory = MovieFactory;
        this.BackgroundFactory = new BackgroundFactory();
        this.isLoading = false;
        this.type = 'seen';
      }

      $onInit() {
        this._getMovies(this.type);

        this.$scope.$on('clickPoster', ($event, data) => {
          this.onClickPoster(data.movie, data.event);
        });
      }

      $onDestroy() {
        this.BackgroundFactory.removeBackground();
      }

      onCloseMovieDetails() {
        this.showMovieDetails = false;
        this.BackgroundFactory.removeBackground();

        this._getMovies(this.type);
      }

      onClickNavigation(type) {
        this.showMovieDetails = false;
        this.BackgroundFactory.removeBackground();

        this._getMovies(type);
      }

      _getMovies(type) {
        this.isLoading = true;
        const promises = [];
        promises.push(this.StorageService.readDB('movie'));
        if (type === 'discover') {
          promises.push(this.TmdbService.getDiscover('top_rated', 20));
        }

        this.$q.all(promises)
          .then(([watchedMovies, discoverMovies]) => {
            let _movies = discoverMovies || Object.keys(watchedMovies).map(id => watchedMovies[id]);
            _movies = _movies.map(movie => new this.MovieFactory(movie, watchedMovies));

            this.movies = _movies;
            this.type = type;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }

      toggleMovieDetails(movie) {
        this.isLoading = true;

        this.BackgroundFactory.addBackground(movie.backdrop || movie.backdrop_path);

        const promises = [this.TmdbService.getMovie(movie.id), this.StorageService.readDB('movie')];

        this.$q.all(promises).then(([movieDetails, moviesSeen]) => {
          this.movieDetails = new this.MovieFactory(movieDetails, moviesSeen);
          this.showMovieDetails = true;
        })
          .finally(() => {
            this.isLoading = false;
          });
      }

      onClickPoster(movie, event) {
        if (event.ctrlKey || event.metaKey) {
          movie.seen = !movie.seen;
          movie.seen ? this.StorageService.addKeyDB('movie', movie) : this.StorageService.deleteKeyDB('movie', movie);
        }
        else {
          this.toggleMovieDetails(movie);
        }
      }
    }],

  });
