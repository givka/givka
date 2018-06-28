angular.module('givka')
  .factory('MovieDetailsFactory', (ColorService) => {
    class MovieDetailsFactory {
      constructor(options) {
        this.backdrop = options.backdrop_path;
        this.hasCollection = options.belongs_to_collection;
        this.id = options.id;
        this.originalTitle = options.orginal_title;
        this.overview = options.overview;
        this.title = options.title;
        this.popularity = options.popularity;
        this.poster = options.poster_path;
        this.releaseDate = options.release_date;
        this.runtime = options.runtime;
        this.tagLine = options.tagline;
        this.voteAverage = options.vote_average;
        this.voteCount = options.vote_count;
        this.credits = this._formatCredits(options.credits);
        this.images = this._formatImages(options.images);
        this.videos = options.videos;
        this.recommendations = this._filterSeen(options.recommendations);
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

      _filterSeen(movies) {
        if (!movies) { return null; }

        movies = movies.results;

        return movies
          .map(movie => new MovieDetailsFactory(movie))
          .filter(movie => movie.poster)
          .map((movie) => {
            // if (moviesDB[movie.id] !== undefined) {
            //   movie.className = 'movie-seen';
            // }
            const vote = movie.voteAverage * 10;
            movie.voteWidth = vote;
            movie.voteColor = ColorService.ratingToColor(vote);
            return movie;
          });
      }
    }

    return MovieDetailsFactory;
  });
