import * as moment from 'moment';

import { Utils } from './utils';
import { Movie } from './movie';

export class MovieDetails extends Movie {
  directorMovies: Movie[];

  collectionMovies: Movie[];

  recoMovies: Movie[];

  collection: any;

  originalTitle: string;

  overview: string;

  runtime: string;

  tagLine: string;

  popularity: string;

  trailer: string;

  credits: any[];

  images: any[];

  directorId: number;

  constructor(options, moviesSeen = {}) {
    super(options, moviesSeen);
    this.collection = options.belongs_to_collection;
    this.originalTitle = options.original_title;
    this.overview = options.overview;
    this.popularity = options.popularity;
    this.runtime = moment.utc().startOf('day').add(options.runtime, 'minutes').format('h[h] mm[min]');
    this.tagLine = options.tagline;
    this.voteCount = options.vote_count;

    this.images = MovieDetails.formatImages(options.images);
    this.trailer = MovieDetails.formatVideos(options.videos);
    this.credits = MovieDetails.formatCredits(options.credits);
    this.recoMovies = MovieDetails.formatRecoMovies(options.recommendations, moviesSeen);
    this.directorId = this.credits && this.credits[0] && this.credits[0].job === 'Director' && this.credits[0].id;

    console.log(this.credits);
  }

  async addDetails(director, collection, moviesSeen) {
    this.collectionMovies = MovieDetails.formatCollectionMovies(collection, moviesSeen);
    this.directorMovies = MovieDetails.formatDirectorMovies(director, moviesSeen);
  }

  private static formatDirectorMovies(director, moviesSeen) {
    const directorMovies = director.movie_credits.crew
      .filter(movie => movie.job === 'Director')
      .map(m => new Movie(m, moviesSeen))
      .filter(m => m.voteCount > 50);
    return Utils.orderBy(directorMovies, 'voteCount');
  }

  private static formatCollectionMovies(collection, moviesSeen): Movie[] {
    if (!collection) { return null; }
    const movies = collection.parts.map(m => new Movie(m, moviesSeen));
    return Utils.orderBy(movies, 'releaseDate', 'asc');
  }

  public toggleSeen(movie: Movie) {
    [].concat(this, this.directorMovies, this.collectionMovies, this.recoMovies)
      .filter(m => m && m.id === movie.id)
      .forEach((m) => { m.seen = !m.seen; });
  }

  private static formatRecoMovies(movies, moviesSeen) {
    return movies.results.map(m => new Movie(m, moviesSeen));
  }

  private static formatImages(images) {
    if (!images) { return null; }
    images = images.backdrops;
    images = Utils.orderBy(images, 'vote_count');
    images = images.slice(0, 6);
    return images;
  }

  private static formatVideos(videos) {
    if (!videos) { return null; }
    let trailers = videos.results.filter(t => t.type === 'Trailer');
    trailers = Utils.orderBy(trailers, 'size');
    return `https://www.youtube.com/watch?v=${trailers[0].key}` || null;
  }

  private static formatCredits(credits) {
    if (!credits) { return null; }
    let directors = credits.crew;
    let actors = credits.cast;
    directors = directors.filter(crew => crew.job === 'Director');
    actors = actors.filter((cast, index) => index < 10 - directors.length);
    return directors.concat(actors).map((credit) => {
      credit.role = credit.job || credit.character;
      return credit;
    });
  }
}

