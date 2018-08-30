angular.module('givka')
  .factory('MovieFactory', (ColorService) => {
    class MovieFactory {
      constructor(options, moviesSeen = {}) {
        this.backdrop = options.backdrop_path || options.backdrop;
        this.hasCollection = options.belongs_to_collection;
        this.id = options.id;
        this.originalTitle = options.orginal_title;
        this.overview = options.overview;
        this.title = options.title;
        this.popularity = options.popularity;
        this.poster = options.poster_path || options.poster;
        this.releaseDate = moment(options.release_date || options.releaseDate, 'YYYY-MM-DD');
        this.runtime = options.runtime;
        this.tagLine = options.tagline;
        this.voteAverage = options.vote_average;
        this.voteCount = options.vote_count;
        this.credits = this._formatCredits(options.credits);
        this.images = this._formatImages(options.images);
        this.videos = options.videos;
        this.recommendations = this._formatMovies(options.recommendations, moviesSeen);
        this.seen = !!moviesSeen[this.id];
      }

      _formatCredits(credits) {
        if (!credits) { return null; }

        let directors = credits.crew;
        let actors = credits.cast;
        directors = directors.filter(crew => crew.job === 'Director');
        actors = actors.filter((cast, index) => index < 10 - directors.length);
        credits = directors.concat(actors);

        return credits.map((credit) => {
          credit.role = credit.job || credit.character;
          return credit;
        });
      }

      _formatImages(images) {
        if (!images) { return null; }
        images = images.backdrops;
        images = _.orderBy(images, e => e.vote_count, 'desc');
        images = images.slice(0, 6);
        return images;
      }

      _formatMovies(movies, moviesSeen) {
        if (!movies) { return null; }

        return movies.results
          .map(movie => new MovieFactory(movie, moviesSeen))
          .filter(movie => movie.poster)
          .map((movie) => {
            const vote = movie.voteAverage * 10;
            movie.voteWidth = vote;
            movie.voteColor = ColorService.ratingToColor(vote);
            return movie;
          });
      }
    }

    return MovieFactory;
  });
