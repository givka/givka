import { SerieResult } from '../types/tmdb';
import { DataBaseSerie } from '../types/database';

export class Serie  {
  public backdrop!: string;

  public id!: number;

  public title!: string;

  public poster!: string;

  public releaseDate!: string;

  public seen!: boolean;

  public voteCount!: number;

  public voteAverage!: number;

  constructor() {  }

  public fromServer(options: SerieResult, database: DataBaseSerie = {}) {
    this.backdrop =  options.backdrop_path;
    this.id = options.id;
    this.title = options.name;
    this.poster = options.poster_path;
    this.releaseDate = options.first_air_date;
    this.voteCount = options.vote_count;
    this.voteAverage = options.vote_average;
    this.seen = !!database[this.id];
    return this;
  }

  public fromStorage(options: Serie, database: DataBaseSerie = {}) {
    this.backdrop =  options.backdrop;
    this.id = options.id;
    this.title = options.title;
    this.poster = options.poster;
    this.releaseDate = options.releaseDate;
    this.voteCount = options.voteCount;
    this.voteAverage = options.voteAverage;
    this.seen = !!database[this.id];
    return this;
  }

  public toggleSeen() {
    this.seen = !this.seen;
  }
}
