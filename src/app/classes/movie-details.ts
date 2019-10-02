import * as moment from 'moment';
import {BelongsToCollection, IDataBaseMovie} from '../interfaces/all';
import {Credit} from './credit';
import {CreditDetails} from './credit-details';
import {Movie} from './movie';
import {TmdbDetails} from './tmdb-details';
import {Utils} from './utils';

export class MovieDetails extends TmdbDetails {
  public recoMovies: Movie[];
  public collection: BelongsToCollection;
  public tagLine: string;
  public director: Credit | null;
  public runtime: string;
  public imdbId: string;
  public directorMovies!: Movie[];
  public collectionMovies!: Movie[];
  public popularity!: string;

  constructor(options: any, database: IDataBaseMovie) {
    super(options, database);
    this.collection = options.belongs_to_collection;
    this.tagLine = options.tagline;
    this.imdbId = options.imdb_id;
    this.runtime = moment.utc().startOf('day')
      .add(options.runtime, 'minutes').format('h[h] mm[min]');
    this.director = this.credits.length ? this.credits[0] : null;

    // TODO: Take into consideration page 2 from recommendations
    this.recoMovies = this.formatRecoMovies(options, database);
  }

  public async addDetails(director: CreditDetails, collection: any, database: IDataBaseMovie) {
    this.collectionMovies = this.formatCollectionMovies(collection, database);
    this.directorMovies = director.directorMovies;
  }

  public toggleListSeen(movie: Movie) {
    Array.prototype.concat(this, this.directorMovies, this.collectionMovies, this.recoMovies)
      .filter(m => m.id === movie.id)
      .forEach((m) => {
        m.seen = !m.seen;
      });
  }

  private formatCollectionMovies(collection: any, database: IDataBaseMovie) {
    if (!collection) {
      return [];
    }
    const movies = collection.parts
      .map((m: any) => new Movie().fromServer(m, database))
      .filter((m: any) => m.poster);
    return Utils.orderBy(movies, 'releaseDate', 'asc');
  }

  private formatRecoMovies(options: any, database: IDataBaseMovie) {
    return options.recommendations.results
      .map((m: any) => new Movie().fromServer(m, database))
      .filter((m: any) => m.poster);
  }
}
