import * as moment from 'moment';
import { Tmdb } from './tmdb';
import { Utils } from './utils';
import { Credit } from './credit';
import { MovieDetailsResult } from '../types/tmdb';
import { DataBaseMovie } from '../types/database';

export class TmdbDetails extends Tmdb {
  public originalTitle!: string;

  public releaseYear: string;

  public overview: string;

  public trailer: string;

  public credits: Credit[];

  public images: string[];

  constructor(options : MovieDetailsResult, database: DataBaseMovie) {
    super();
    super.formatServer(options, database);
    this.overview = options.overview;
    this.releaseYear = moment(options.release_date, 'YYYY-MM-DD').format('YYYY');
    this.trailer = this.formatVideos(options);
    this.credits = this.formatCredits(options);
    this.images = this.formatImages(options);
  }

  private formatVideos(options : MovieDetailsResult) {
    const { results } = options.videos;
    let trailers = results.filter(t => t.type === 'Trailer');
    if (!trailers.length) { trailers = results; }
    trailers = Utils.orderBy(trailers, 'size');
    return trailers[0]
    ? `https://www.youtube.com/watch?v=${trailers[0].key}`
    : `https://www.youtube.com/results?search_query=${this.title}+${this.releaseYear}`;
  }

  private formatCredits(options : MovieDetailsResult) {
    const directors = options.credits.crew
    .filter(crew => crew.job === 'Director')
    .map(c => new Credit().fromCrew(c));

    const actors = options.credits.cast.map(c => new Credit().fromCast(c));

    return Array.prototype.concat(directors, actors)
    .filter((credit, index) => index < 20);
  }

  private formatImages(options : MovieDetailsResult) {
    return  Utils.orderBy(options.images.backdrops, 'vote_count')
    .map(image => image.file_path);
  }
}
