import * as moment from 'moment';
import { IDataBaseMovie } from '../interfaces/all';
import { Credit } from './credit';
import { Tmdb } from './tmdb';
import { Utils } from './utils';

export class TmdbDetails extends Tmdb {
  public originalTitle: string;

  public releaseYear: string;

  public overview: string;

  public trailer: string;

  public credits: Credit[];

  public images: string[];

  constructor(options: any, database: IDataBaseMovie) {
    super();
    super.formatServer(options, database);
    this.originalTitle = options.original_title || options.original_name;
    this.overview = options.overview;
    this.releaseYear = moment(this.releaseDate, 'YYYY-MM-DD').format('YYYY');
    this.trailer = this.formatVideos(options);
    this.credits = this.formatCredits(options);
    this.images = this.formatImages(options);
  }

  private formatVideos(options: any) {
    const { results } = options.videos;
    let trailers = results.filter((t: any) => t.type === 'Trailer');
    if (!trailers.length) { trailers = results; }
    trailers = Utils.orderBy(trailers, 'size');
    return trailers[0]
    ? `https://www.youtube.com/watch?v=${trailers[0].key}`
    : `https://www.youtube.com/results?search_query=${this.title}+${this.releaseYear}`;
  }

  private formatCredits(options: any) {
    const directors = options.credits.crew
    .filter((crew: any) => crew.job === 'Director')
    .map((c: any) => new Credit().fromCrew(c));

    const actors = options.credits.cast.map((c: any) => new Credit().fromCast(c));

    return Array.prototype.concat(directors, actors)
    .filter((credit, index) => index < 20);
  }

  private formatImages(options: any) {
    return  Utils.orderBy(options.images.backdrops, 'vote_count')
    .map((image: any) => image.file_path);
  }
}
