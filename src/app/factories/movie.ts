import * as moment from 'moment';

export class Movie {
  public backdrop: string;

  public id: number;

  public title: string;

  public poster: string;

  public releaseDate: string;

  public seen: boolean;

  public voteCount: number;

  public voteAverage: number;

  constructor(options, moviesSeen = {}) {
    this.backdrop = options.backdrop_path || options.backdrop;
    this.id = options.id;
    this.title = options.title;
    this.poster = options.poster_path || options.poster;
    this.releaseDate = moment(options.release_date || options.releaseDate).format('LL');
    this.voteCount = options.vote_count || options.voteCount;
    this.voteAverage = options.vote_average || options.voteAverage;
    this.seen = !!moviesSeen[this.id];
  }

  toggleSeen(movie: Movie) {
    this.seen = !this.seen;
  }
}

