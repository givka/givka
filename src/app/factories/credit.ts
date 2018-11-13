import { Movie } from './movie';
import { Utils } from './utils';

export class Credit {
  name: string;

  id: number;

  biography: string;

  birthday: string;

  deathday: string;

  images: string[];

  knowFor: string;

  actorMovies: Movie[];

  directorMovies: Movie[];

  birthPlace: string;

  profile: string;

  constructor(options, moviesSeen = {}) {
    this.name = options.name;
    this.id = options.id;
    this.biography = options.biography;
    this.birthday = options.birthday;
    this.deathday = options.deathday;
    this.images = options.images.profiles.concat(options.tagged_images.results);
    this.knowFor = options.known_for_department;
    this.actorMovies = this.formatMovies(options.movie_credits.cast, moviesSeen);
    this.directorMovies = this.formatDirectorMovies(options.movie_credits.crew, moviesSeen);
    this.birthPlace = options.place_of_birth;
    this.profile = options.profile_path;
  }

  private formatDirectorMovies(movies, moviesSeen) {
    const directorMovies = movies.filter(m => m.job === 'Director');
    return this.formatMovies(directorMovies, moviesSeen);
  }

  private formatMovies(movies, moviesSeen) {
    if (!movies.length) return null;
    const moviesFormatted = movies.map(m => new Movie(m, moviesSeen))
      .filter(m => m.poster && m.voteCount && m.backdrop && m.voteCount > 50);
    return Utils.orderBy(moviesFormatted, 'voteCount');
  }
}
