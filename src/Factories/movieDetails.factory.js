angular.module('givka')
  .factory('MovieDetailsFactory', () => {
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
        this.credits = options.credits;
        this.images = options.images;
        this.videos = options.videos;
        this.recommendations = options.recommendations;
      }
    }

    return MovieDetailsFactory;
  });
