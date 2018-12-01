import * as moment from 'moment';
import { Utils } from './utils';
import { Movie } from './movie';
import { MovieDetailsResult, Collection, BelongsToCollection } from '../types/tmdb';
import { Credit } from './credit';
import { DataBaseMovie } from '../types/database';
import { TmdbDetails } from './tmdb-details';
import { CreditDetails } from './credit-details';

export class MovieDetails extends TmdbDetails{
  originalTitle: string;

  directorMovies!: Movie[];

  collectionMovies!: Movie[];

  recoMovies: Movie[];

  collection!: BelongsToCollection;

  tagLine: string;

  imdbId: string;

  popularity!: string;

  director: Credit | null;

  runtime: string;

  constructor(options : MovieDetailsResult, database: DataBaseMovie) {
    super(options, database);
    this.title =  options.title;
    this.releaseDate = options.release_date;
    this.originalTitle = options.original_title;
    this.collection = options.belongs_to_collection;
    this.tagLine = options.tagline;
    this.imdbId = options.imdb_id;
    this.runtime = moment.utc().startOf('day')
    .add(options.runtime, 'minutes').format('h[h] mm[min]');
    this.director = this.credits.length ? this.credits[0] : null;

    // TODO: Take into consideration page 2 from recommendations
    this.recoMovies = this.formatRecoMovies(options, database);

    console.log(this);

  }

  private formatCollectionMovies(collection : Collection, moviesSeen: DataBaseMovie) {
    if (!collection) { return []; }
    const movies = collection.parts.map(m => new Movie().fromServer(m, moviesSeen))
      .filter(m => m.poster);
    return Utils.orderBy(movies, 'releaseDate', 'asc');
  }

  private formatRecoMovies(options : MovieDetailsResult, database: DataBaseMovie) {
    return options.recommendations.results
    .map(m => new Movie().fromServer(m, database));
  }

  async addDetails(director: CreditDetails, collection: Collection, moviesSeen: DataBaseMovie) {
    this.collectionMovies = this.formatCollectionMovies(collection, moviesSeen);
    this.directorMovies = director.directorMovies;
  }

  public toggleListSeen(movie: Movie) {
    Array.prototype.concat(this, this.directorMovies, this.collectionMovies, this.recoMovies)
      .filter(m => m.id === movie.id)
      .forEach((m) => { m.seen = !m.seen; });
  }
}
