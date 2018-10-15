import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Movie } from '../../factories/movie';
import { MovieDetails } from '../../factories/movie-details';

import { TmdbService } from '../../services/tmdb.service';
import { StorageService } from '../../services/storage.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movies-component',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class MoviesComponent implements OnInit, OnDestroy {
  movies: Movie[];

  movieDetails: MovieDetails;

  showMovieDetails: boolean = false;

  loading: boolean = true;

  type: string;

  subscription: Subscription;

  constructor(
    private tmdb: TmdbService,
    private storage: StorageService,
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.clickOnDiscover();
    this.subscription = this.movieService.getMovie()
      .subscribe((subject) => {
        this.onClickPoster(subject.movie, subject.event);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async clickOnDiscover() {
    this.type = 'discover';
    this.loading = true;
    this.showMovieDetails = false;

    this.movies = await this.tmdb.getDiscover('top_rated')
      .finally(() => { this.loading = false; });
  }

  async clickOnSeen() {
    this.type = 'seen';
    this.loading = true;
    this.showMovieDetails = false;

    const seen = await this.storage.readDB('movie');
    this.movies = Object.keys(seen).map(movie => new Movie(seen[movie], seen));
    this.loading = false;
  }

  public onClickPoster(movie: Movie | MovieDetails, event) {
    if (event.ctrlKey || event.metaKey) {
      this.showMovieDetails ? this.movieDetails.toggleSeen(movie) : movie.toggleSeen(movie);
      movie.seen ? this.storage.addKeyDB('movie', movie) : this.storage.deleteKeyDB('movie', movie);
    } else {
      this.goToMovieDetails(movie);
    }
  }

  goToMovieDetails(movie: Movie) {
    this.loading = true;

    // this.BackgroundFactory.addBackground(movie.backdrop || movie.backdrop_path);

    this.tmdb.getMovieDetails(movie.id)
      .then((movieDetails) => {
        this.movieDetails = movieDetails;
        console.log(this.movieDetails);
        this.showMovieDetails = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
