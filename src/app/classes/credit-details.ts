import { uniqBy } from 'lodash';
import * as moment from 'moment';
import { IDataBaseMovie, IDataBaseSerie } from '../interfaces/all';
import { Credit } from './credit';
import { Movie } from './movie';
import { Serie } from './serie';
import { Utils } from './utils';

export class CreditDetails extends Credit {
  public biography: string;
  public birthday: string | null;
  public deathday: string | null;
  public images: string[];
  public knownFor: string;
  public actorMovies: Movie[];
  public directorMovies: Movie[];
  public actorSeries: Serie[];
  public creatorSeries: Serie[];
  public birthPlace: string;
  public age: number | null;
  public imdbId!: string;

  constructor(options: any, databaseMovies: IDataBaseMovie, databaseSeries: IDataBaseSerie) {
    super();
    super.fromDetails(options);
    this.biography = options.biography;
    this.birthday = options.birthday ? moment(options.birthday, 'YYYY-MM-DD').format('ll') : null;
    this.deathday = options.deathday ? moment(options.deathday, 'YYYY-MM-DD').format('ll') : null;
    this.age = this.formatAge(options);
    this.knownFor = options.known_for_department;
    this.birthPlace = options.place_of_birth;
    this.images = this.formatImages(options);
    this.actorMovies = this.formatActorMovies(options, databaseMovies);
    this.directorMovies = this.formatDirectorMovies(options, databaseMovies);
    this.actorSeries = this.formatActorSeries(options, databaseSeries);
    this.creatorSeries = this.formatCreatorSeries(options, databaseSeries);
    this.imdbId = options.imdb_id;
  }

  private formatAge(options: any) {
    const birthday = options.birthday;
    const deathday = options.deathday;
    if (deathday && birthday) {
      return moment(deathday, 'YYYY-MM-DD').diff(moment(birthday, 'YYYY-MM-DD'), 'year');
    } if (birthday) {
      return moment().diff(moment(birthday, 'YYYY-MM-DD'), 'year');
    } return null;
  }

  private formatDirectorMovies(options: any, database: IDataBaseMovie) {
    const directorMovies = options.movie_credits.crew.filter((m: any) => m.job === 'Director');
    return this.formatMovies(directorMovies, database);
  }

  private formatActorMovies(options: any, database: IDataBaseMovie) {
    const actorMovies = options.movie_credits.cast;
    return this.formatMovies(actorMovies, database);
  }

  private formatMovies(movies: any[], database: IDataBaseMovie) {
    const moviesFormatted = movies.map(m => new Movie().fromServer(m, database))
      .filter(m => m.poster && m.voteCount && m.backdrop);
    return Utils.orderBy(moviesFormatted, 'voteCount');
  }

  private formatCreatorSeries(options: any, database: IDataBaseSerie) {
    const creatorSeries = options.tv_credits.crew
    .filter((m: any) => m.job === 'Creator' || m.job === 'Director' || m.job === 'Writer');
    return this.formatSeries(creatorSeries, database);
  }

  private formatActorSeries(options: any, database: IDataBaseSerie) {
    const actorSeries = options.tv_credits.cast;
    return this.formatSeries(actorSeries, database);
  }

  private formatSeries(series: any[], database: IDataBaseSerie) {
    const seriesFormatted = series.map(m => new Serie().fromServer(m, database))
      .filter(m => m.poster && m.voteCount && m.backdrop);
    return uniqBy(Utils.orderBy(seriesFormatted, 'voteCount'), s => s.id);
  }

  private formatImages(options: any) {
    const images = options.images.profiles;
    return Utils.orderBy(images, 'voteCount').map((i:any) => i.file_path);
  }
}
