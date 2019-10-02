import {IDataBaseSerie} from '../interfaces/all';
import {Tmdb} from './tmdb';

export class Serie extends Tmdb {
  constructor() {
    super();
  }

  public fromServer(options: any, database: IDataBaseSerie) {
    super.formatServer(options, database);
    return this;
  }

  public fromStorage(options: any) {
    super.formatStorage(options);
    return this;
  }
}
