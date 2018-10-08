angular.module('givka')
  .factory('MovieFactory', ($q, ColorService, TmdbService) => {
    class MovieFactory {
      constructor(options, moviesSeen = {}) {
        this.backdrop = options.backdrop_path || options.backdrop;
        this.hasCollection = options.belongs_to_collection;
        this.id = options.id;
        this.originalTitle = options.original_title;
        this.overview = options.overview;
        this.title = options.title;
        this.popularity = options.popularity;
        this.poster = options.poster_path || options.poster;
        this.releaseDate = options.release_date || options.releaseDate;
        // moment(options.release_date || options.releaseDate, 'YYYY-MM-DD');
        this.runtime = options.runtime;
        this.tagLine = options.tagline;
        this.voteAverage = options.vote_average;
        this.voteCount = options.vote_count;
        this.credits = this._formatCredits(options.credits);
        this.images = this._formatImages(options.images);
        this.videos = options.videos;
        this.recommendations = this._formatMovies(options.recommendations && options.recommendations.results, moviesSeen);
        this.seen = !!moviesSeen[this.id];
        this.trailer = this._formatTrailer(options.videos);
      }

      _formatTrailer(videos) {
        if (!videos) { return null; }

        let trailers = videos.results.filter(t => t.type === 'Trailer');

        trailers = this.sortByKey(trailers, 'size');

        return trailers[0].key || null;
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

        return movies
          .map(movie => new MovieFactory(movie, moviesSeen))
          .filter(movie => movie.poster)
          .map((movie) => {
            const vote = movie.voteAverage * 10;
            movie.voteWidth = vote;
            movie.voteColor = ColorService.ratingToColor(vote);
            return movie;
          });
      }

      getDetails(moviesSeen) {
        return $q.all([
          this._getDirectorMovies(moviesSeen),
          this._getCollectionMovies(moviesSeen),
        ])
          .then(([directorMovies, collectionMovies]) => {
            this.directorMovies = directorMovies;
            this.collectionMovies = collectionMovies;
            return this;
          });
      }

      _getDirectorMovies(moviesSeen) {
        const director = this.credits[0];
        if (!director || director.job !== 'Director') { return null; }

        return TmdbService.getPeople(director.id)
          .then((_director) => {
            let movies = _director.movie_credits.crew;

            movies = movies.filter(movie => movie.job === 'Director');

            movies = this._formatMovies(movies, moviesSeen);
            movies = this.sortByKey(movies, 'voteCount');

            movies = movies.filter(m => m.voteCount > 50);

            return movies;
          });
      }

      async _getCollectionMovies(moviesSeen) {
        if (!this.hasCollection) { return null; }
        const collection = await TmdbService.getCollection(this.hasCollection.id);
        let movies = collection.parts;
        movies = this._formatMovies(movies, moviesSeen);

        movies = this.sortByKey(movies, 'releaseDate');

        return movies;
      }

      sortByKey(movies, key) {
        return _.orderBy(movies, movie => movie[key], 'desc');
      }

      toggleSeen(movie, showMovieDetails) {
        if (showMovieDetails) {
          [].concat(movie.directorMovies, movie.collectionMovies, movie.recommendations)
            .filter(m => m)
            .filter(m => m.id === this.id)
            .forEach((m) => { m.seen = !m.seen; });
        }
        else {
          this.seen = !this.seen;
        }
      }

      getTrailerKey() {
        return `https://www.youtube.com/embed/${this.trailer}`;
      }
    }

    return MovieFactory;
  });
