import { Movie } from './movie';
import { MovieResult, SerieResult, isSerieResult } from '../types/tmdb';
import { Serie } from './serie';
import { DataBaseMovie, DataBaseSerie } from '../types/database';

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

  public formatServer(options: MovieResult | SerieResult,
                      database: DataBaseMovie | DataBaseSerie) {
    this.backdrop = options.backdrop_path;
    this.id = options.id;
    this.poster = options.poster_path;
    this.voteCount = options.vote_count;
    this.voteAverage = options.vote_average;
    this.seen = !!database[options.id];
  }

  public toggleSeen() {
    this.seen = !this.seen;
  }
}
