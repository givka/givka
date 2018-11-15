import { Tmdb } from './tmdb';

export class Movie extends Tmdb {
  constructor(options, database = {}) {
    super(options, database);
  }
}

