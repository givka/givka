export class Tmdb {
  public backdrop: string;

  public id: number;

  public title: string;

  public poster: string;

  public releaseDate: string;

  public seen: boolean;

  public voteCount: number;

  public voteAverage: number;

  constructor(options, database = {}) {
    this.backdrop = options.backdrop_path || options.backdrop;
    this.id = options.id;
    this.title = options.title || options.name;
    this.poster = options.poster_path || options.poster;
    this.releaseDate = options.release_date || options.first_air_date || options.releaseDate;
    this.voteCount = options.vote_count || options.voteCount;
    this.voteAverage = options.vote_average || options.voteAverage;
    this.seen = !!database[this.id];
  }

  public toggleSeen() {
    this.seen = !this.seen;
  }
}
