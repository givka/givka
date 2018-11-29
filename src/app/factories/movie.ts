import { MovieResult } from '../types/tmdb';
import { DataBaseMovie } from '../types/database';

export class Movie {
  public backdrop!: string;

  public id!: number;

  public title!: string;

  public poster!: string;

  public releaseDate!: string;

  public seen!: boolean;

  public voteCount!: number;

  public voteAverage!: number;

  public fromServer(options: MovieResult, database: DataBaseMovie = {}) {
    this.backdrop =  options.backdrop_path;
    this.id = options.id;
    this.title = options.title;
    this.poster = options.poster_path;
    this.releaseDate = options.release_date;
    this.voteCount = options.vote_count;
    this.voteAverage = options.vote_average;
    this.seen = !!database[this.id];
    return this;
  }

  public fromStorage(options: Movie, database: DataBaseMovie = {}) {
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
