angular.module('givka')
  .component('mainComponent', {
    bindings: {},
    templateUrl: 'Components/main.component.html',
    controller: ['$timeout', 'TmdbService', 'MovieDetailsFactory', class MainComponent {
      constructor($timeout, TmdbService, MovieDetailsFactory) {
        this.$timeout = $timeout;
        this.TmdbService = TmdbService;
        this.MovieDetailsFactory = MovieDetailsFactory;
        this.moviesType = 'seen';
        this.ruleAdded = false;
      }

      $onInit() {
        this._initStyleSheet();
      }

      toggleMovieDetails(movie) {
        this.isLoading = true;

        this._createRule(movie.backdrop_path || movie.backdrop);

        this.TmdbService.getMovie(movie.id)
          .then((result) => {
            this.movieDetails = new this.MovieDetailsFactory(result);
            this.showMovieDetails = true;
          })
          .finally(() => { this.isLoading = false; });
      }

      onCloseMovieDetails() {
        this.showMovieDetails = false;

        this._deleteRule();
      }

      onClickNavigation(type) {
        this.moviesType = type;
        this.showMovieDetails = false;
        this._deleteRule();
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
        this.isLoading = true;
        this.$timeout(() => {
          this.isLoading = false;
        }, 500);
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
