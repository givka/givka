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

  constructor(options, databaseMovies = {}, databaseSeries = {}) {
    super(options);

    this.biography = options.biography;
    this.birthday = options.birthday;
    this.deathday = options.deathday;
    this.knownFor = options.known_for_department;
    this.birthPlace = options.place_of_birth;
    this.images = this.formatImages(options.images, options.tagged_images);
    this.actorMovies = this.formatMovies(options.movie_credits.cast, databaseMovies);
    this.directorMovies = this.formatDirectorMovies(options.movie_credits.crew, databaseMovies);
    this.actorSeries = this.formatSeries(options.tv_credits.cast, databaseSeries);
    this.creatorSeries = this.formatCreatorSeries(options.tv_credits.crew, databaseSeries);
  }

  private formatDirectorMovies(movies, database) {
    const directorMovies = movies.filter(m => m.job === 'Director');
    return this.formatMovies(directorMovies, database);
  }

  private formatMovies(movies, database) {
    if (!movies.length) return null;
    const moviesFormatted = movies.map(m => new Movie(m, database))
      .filter(m => m.poster && m.voteCount && m.backdrop);
    return Utils.orderBy(moviesFormatted, 'voteCount');
  }

  private formatCreatorSeries(series, database) {
    const creatorSeries = series.filter(m => m.job === 'Creator' || m.job === 'Director');
    return this.formatSeries(creatorSeries, database);
  }

  private formatSeries(series, database) {
    if (!series.length) return null;
    const seriesFormatted = series.map(m => new Serie(m, database))
      .filter(m => m.poster && m.voteCount && m.backdrop);
    return Utils.orderBy(seriesFormatted, 'voteCount');
  }

  private formatImages(images, taggedImages) {
    return images.profiles.concat(taggedImages.results).map(i => i.file_path);
  }
}
