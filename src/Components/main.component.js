angular.module('givka')
  .component('mainComponent', {
    bindings: {},
    templateUrl: 'Components/main.component.html',
    controller: ['$timeout', '$q', 'TmdbService', 'MovieDetailsFactory', 'StorageService', class MainComponent {
      constructor($timeout, $q, TmdbService, MovieDetailsFactory, StorageService) {
        this.$timeout = $timeout;
        this.$q = $q;
        this.TmdbService = TmdbService;
        this.MovieDetailsFactory = MovieDetailsFactory;
        this.StorageService = StorageService;

        this.ruleAdded = false;
        this.type = 'seen';
      }

      $onInit() {
        this._initStyleSheet();
        this._getMovies(this.type);
      }

      toggleMovieDetails(movie) {
        this.isLoading = true;
        this._createRule(movie.backdrop_path || movie.backdrop);
        this.TmdbService.getMovie(movie.id)
          .then((result) => {
            this.movieDetails = new this.MovieDetailsFactory(result);
            this.showMovieDetails = true;
          })
          .finally(() => {
            this.$timeout(() => { this.isLoading = false; }, 1000);
          });
      }

      onCloseMovieDetails() {
        this.showMovieDetails = false;
        this._deleteRule();

        this.isLoading = true;
        this.$timeout(() => { this.isLoading = false; }, 1000);
      }

      onClickNavigation(type) {
        this.showMovieDetails = false;
        this._deleteRule();

        if (this.type !== type) {
          this._getMovies(type);
        }
        else {
          this.isLoading = true;
          this.$timeout(() => { this.isLoading = false; }, 1000);
        }
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
            _movies = this._filterSeen(_movies, watchedMovies);
            this.movies = _movies;
            this.type = type;
          })
          .finally(() => {
            this.$timeout(() => { this.isLoading = false; }, 1000);
          });
      }

      _filterSeen(movies, moviesSeen) {
        return movies.map((movie) => {
          movie.seen = !!moviesSeen[movie.id];
          return movie;
        });
      }

      _initStyleSheet() {
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        this.styleSheet = styleEl.sheet;
      }

      async _createRule(backdrop) {
        const bgImg = `https://image.tmdb.org/t/p/w300${backdrop}`;

        const blur = await this._blurBase64URI(bgImg, 3);

        if (this.ruleAdded) {
          this.styleSheet.deleteRule(0);
        }
        else {
          this.ruleAdded = true;
        }
        const background = `url(${blur})`;
        const rule = `.main-content::before {
          z-index: -1 !important;
          content: ' ' !important;
          position: fixed !important;
          background-image: ${background} !important;
          background-size: cover !important; 
          will-change: transform !important;
          transform: scale(1) !important;
        }`;
        this.styleSheet.insertRule(rule, 0);
      }

      async _deleteRule() {
        if (this.ruleAdded) {
          this.styleSheet.deleteRule(0);
          this.ruleAdded = false;
        }
      }

      _blurBase64URI(bgImg, pixels) {
        return new Promise((resolve) => {
          Jimp.read(bgImg)
            .then((image) => {
              image.color([{ apply: 'shade', params: [70] }])
                .blur(pixels)
                .getBase64(Jimp.AUTO, (err, encoded) => {
                  resolve(encoded);
                });
            });
        });
      }
    }],

  });
