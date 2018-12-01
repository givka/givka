import { SerieResult } from '../types/tmdb';
import { DataBaseSerie } from '../types/database';
import { Tmdb } from './tmdb';

export class Serie extends Tmdb{
  constructor() {
    super();
  }

  public fromServer(options: SerieResult, database: DataBaseSerie) {
    this.title =  options.name;
    this.releaseDate = options.first_air_date;
    super.formatServer(options, database);
    return this;
  }

  public fromStorage(options: Serie) {
    super.formatStorage(options);
    return this;
  }
}
