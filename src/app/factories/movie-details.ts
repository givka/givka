import * as moment from 'moment';

import { Utils } from './utils';
import { Movie } from './movie';
import { TmdbDetails } from './tmdb-details';

export class MovieDetails extends TmdbDetails {
  directorMovies: Movie[];

  collectionMovies: Movie[];

  recoMovies: Movie[];

  collection: any;

  tagLine: string;

  imdbId: string;

  popularity: string;

  director: any;

  runtime: string;

  constructor(options, moviesSeen = {}) {
    super(options, moviesSeen);
    this.collection = options.belongs_to_collection;
    this.tagLine = options.tagline;
    this.imdbId = options.imdb_id;
    this.voteCount = options.vote_count;
    this.runtime = moment.utc().startOf('day').add(options.runtime, 'minutes').format('h[h] mm[min]');
    [this.director] = this.credits;

    // TODO: Take into consideration page 2 from recommendations
    this.recoMovies = this.formatRecoMovies(options.recommendations, moviesSeen);
  }

  async addDetails(director, collection, moviesSeen) {
    this.collectionMovies = this.formatCollectionMovies(collection, moviesSeen);
    this.directorMovies = director.directorMovies;
  }

  private formatCollectionMovies(collection, moviesSeen): Movie[] {
    if (!collection) { return []; }
    const movies = collection.parts.map(m => new Movie(m, moviesSeen))
      .filter(m => m.poster);
    return Utils.orderBy(movies, 'releaseDate', 'asc');
  }

  public toggleListMoviesSeen(movie: Movie) {
    [].concat(this, this.directorMovies, this.collectionMovies, this.recoMovies)
      .filter(m => m && m.id === movie.id)
      .forEach((m) => { m.seen = !m.seen; });
  }

  private formatRecoMovies(movies, moviesSeen) {
    if (!movies.results.length) { return null; }
    return movies.results.map(m => new Movie(m, moviesSeen));
  }
}

