import * as moment from 'moment';
import { Movie } from './movie';
import { Utils } from './utils';
import { Serie } from './serie';
import { Credit } from './credit';

export class CreditDetails extends Credit {
  biography: string;

  birthday: string;

  deathday: string;

  images: string[];

  knownFor: string;

  actorMovies: Movie[];

  directorMovies: Movie[];

  actorSeries: Serie[];

  creatorSeries: Serie[];

  birthPlace: string;

  age:number;

  constructor(options, databaseMovies = {}, databaseSeries = {}) {
    super();
    super.fromDetails(options);
    this.biography = options.biography;
    this.birthday = options.birthday ? moment(options.birthday, 'YYYY-MM-DD').format('ll') : null;
    this.deathday = options.deathday ? moment(options.deathday, 'YYYY-MM-DD').format('ll') : null;
    this.age = this.formatAge(options.birthday, options.deathday);

    this.knownFor = options.known_for_department;
    this.birthPlace = options.place_of_birth;
    this.images = this.formatImages(options.images, options.tagged_images);
    this.actorMovies = this.formatMovies(options.movie_credits.cast, databaseMovies);
    this.directorMovies = this.formatDirectorMovies(options.movie_credits.crew, databaseMovies);
    this.actorSeries = this.formatSeries(options.tv_credits.cast, databaseSeries);
    this.creatorSeries = this.formatCreatorSeries(options.tv_credits.crew, databaseSeries);
  }

  private formatAge(birthday, deathday) {
    if (deathday && birthday) {
      return moment(deathday, 'YYYY-MM-DD').diff(moment(birthday, 'YYYY-MM-DD'), 'year');
    } if (birthday) {
      return moment().diff(moment(birthday, 'YYYY-MM-DD'), 'year');
    }
    return null;
  }

  private formatDirectorMovies(movies, database) {
    const directorMovies = movies.filter(m => m.job === 'Director');
    return this.formatMovies(directorMovies, database);
  }

  private formatMovies(movies, database) {
    const moviesFormatted = movies.map(m => new Movie().fromServer(m, database))
      .filter(m => m.poster && m.voteCount && m.backdrop);
    return Utils.orderBy(moviesFormatted, 'voteCount');
  }

  private formatCreatorSeries(series, database) {
    const creatorSeries = series.filter(m => m.job === 'Creator' || m.job === 'Director');
    return this.formatSeries(creatorSeries, database);
  }

  private formatSeries(series, database) {
    const seriesFormatted = series.map(m => new Serie().fromServer(m, database))
      .filter(m => m.poster && m.voteCount && m.backdrop);
    return Utils.orderBy(seriesFormatted, 'voteCount');
  }

  private formatImages(images, taggedImages) {
    return images.profiles.concat(taggedImages.results).map(i => i.file_path);
  }
}
