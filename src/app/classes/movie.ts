import {IDataBaseMovie} from '../interfaces/all';
import {Tmdb} from './tmdb';

export class Movie extends Tmdb {
  constructor() {
    super();
  }

  public fromServer(options: any, database: IDataBaseMovie) {
    super.formatServer(options, database);
    return this;
  }

  public fromStorage(options: any) {
    super.formatStorage(options);
    return this;
  }
}
