import * as moment from 'moment';
import { Utils } from './utils';
import { Movie } from './movie';
import { MovieDetailsResult, Collection } from '../types/tmdb';
import { Credit } from './credit';
import { DataBaseMovie } from '../types/database';

export class MovieDetails extends Movie{
  directorMovies!: Movie[];

  collectionMovies!: Movie[];

  recoMovies: Movie[];

  collection: any;

  tagLine: string;

  imdbId: string;

  popularity!: string;

  director: any;

  runtime: string;

  public originalTitle: string;

  public releaseYear: string;

  public overview: string;

  public trailer: string;

  public credits: Credit[];

  public images: any[];

  constructor(options : MovieDetailsResult, moviesSeen: DataBaseMovie = {}) {
    super();
    this.fromServer(options);

    this.originalTitle = options.original_title;
    this.overview = options.overview;
    this.releaseYear = moment(this.releaseDate, 'YYYY-MM-DD').format('YYYY');
    this.trailer = this.formatVideos(options);
    this.credits = this.formatCredits(options);
    this.images = this.formatImages(options);

    this.collection = options.belongs_to_collection;
    this.tagLine = options.tagline;
    this.imdbId = options.imdb_id;
    this.voteCount = options.vote_count;
    this.runtime = moment.utc().startOf('day')
    .add(options.runtime, 'minutes').format('h[h] mm[min]');
    [this.director] = this.credits;

    // TODO: Take into consideration page 2 from recommendations
    this.recoMovies = this.formatRecoMovies(options, moviesSeen);

  }

  private formatCollectionMovies(collection : Collection | null, moviesSeen: DataBaseMovie) {
    if (!collection) { return []; }
    const movies = collection.parts.map(m => new Movie().fromServer(m, moviesSeen))
      .filter(m => m.poster);
    return Utils.orderBy(movies, 'releaseDate', 'asc');
  }

  private formatRecoMovies(options : MovieDetailsResult, moviesSeen: DataBaseMovie) {
    return options.recommendations.results.map(m => new Movie().fromServer(m, moviesSeen));
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
    let directors = options.credits.crew;
    let actors = options.credits.cast;
    directors = directors.filter(crew => crew.job === 'Director');
    actors = actors.filter((cast, index) => cast.profile_path)
      .filter((cast, index) => index < 20);
    return Array.prototype.concat(directors, actors).map(c => new Credit(c));
  }

  private formatImages(options : MovieDetailsResult) {
    return  Utils.orderBy(options.images.backdrops, 'vote_count')
    .map(image => image.file_path);
  }

  async addDetails(director, collection, moviesSeen: DataBaseMovie) {
    this.collectionMovies = this.formatCollectionMovies(collection, moviesSeen);
    this.directorMovies = director.directorMovies;
  }

  public toggleListSeen(movie: Movie) {
    [].concat(this, this.directorMovies, this.collectionMovies, this.recoMovies)
      .filter(m => m && m.id === movie.id)
      .forEach((m) => { m.seen = !m.seen; });
  }
}
