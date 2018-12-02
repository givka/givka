import { IDataBaseMovie, IDataBaseSerie } from '../interfaces/all';
import { Movie } from './movie';
import { Serie } from './serie';

export class Tmdb {
  public backdrop!: string;

  public id!: number;

  public title!: string;

  public poster!: string;

  public releaseDate!: string;

  public seen!: boolean;

  public voteCount!: number;

  public voteAverage!: number;

  public formatStorage(options: Movie | Serie) {
    this.backdrop = options.backdrop;
    this.id = options.id;
    this.title = options.title;
    this.poster = options.poster;
    this.releaseDate = options.releaseDate;
    this.seen = options.seen;
    this.voteCount = options.voteCount;
    this.voteAverage = options.voteAverage;
  }

  public formatServer(options: any, database: IDataBaseMovie | IDataBaseSerie) {
    this.backdrop = options.backdrop_path;
    this.id = options.id;
    this.poster = options.poster_path;
    this.voteCount = options.vote_count;
    this.voteAverage = options.vote_average;
    this.seen = !!database[options.id];
    this.releaseDate = options.release_date || options.first_air_date;
    this.title = options.title || options.name;
  }

  public toggleSeen() {
    this.seen = !this.seen;
  }
}
