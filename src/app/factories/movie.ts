import { MovieResult } from '../types/tmdb';
import { DataBaseMovie } from '../types/database';
import { Tmdb } from './tmdb';

export class Movie extends Tmdb{
  constructor() {
    super();
  }

  public fromServer(options: MovieResult, database: DataBaseMovie = {}) {
    super.formatServer(options, database);
    this.title =  options.title;
    this.releaseDate = options.release_date;
    return this;
  }

  public fromStorage(options: Movie, database: DataBaseMovie = {}) {
    super.formatStorage(options);
    return this;
  }
}
