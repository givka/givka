import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Background } from '../../factories/background';
import { Movie } from '../../factories/movie';
import { MovieDetails } from '../../factories/movie-details';
import { Storage } from '../../factories/storage';
import { Credit } from '../../factories/credit';

import { TmdbService } from '../../services/tmdb.service';
import { Utils } from '../../factories/utils';
import { BroadcastService } from '../../services/broadcast.service';

@Component({
  selector: 'movies-component',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None
  })

export class MoviesComponent implements OnInit, OnDestroy {
  movies: Movie[];

  tabSelected = 'movies'

  movieDetails: MovieDetails;

  showMovieDetails = false;

  creditDetails

  loading = true;

  type = 'seen';

  subscription: Subscription;

  background: Background = new Background();

  orderAsc = {
    title: true, releaseDate: true, voteAverage: false, voteCount: false,
  };

  constructor(
    private tmdb: TmdbService,
    private broadcast: BroadcastService,
  ) { }

  ngOnInit() {
    this.clickOnSeen();
    this.subscription = this.broadcast.getMovie()
      .subscribe((subject) => {
        if (subject.credit) {
          this.onClickCredit(subject.credit, subject.event);
        } else this.onClickPoster(subject.movie, subject.event);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.background.removeBackground();
  }

  onClickCredit(credit, event) {
    this.tabSelected = 'creditDetails';
    this.loading = true;
    this.tmdb.getPeople(credit.id)
      .then((data) => { this.creditDetails = new Credit(data); })
      .finally(() => { this.loading = false; });
  }

  onCloseMovieDetails() {
    this.tabSelected = 'movies';

    this.showMovieDetails = false;
    this.background.removeBackground();
  }

  async clickOnDiscover(key) {
    this.tabSelected = 'movies';
    this.type = 'discover';
    this.loading = true;
    this.onCloseMovieDetails();

    this.movies = await this.tmdb.getDiscover(key)
      .finally(() => { this.loading = false; });
  }

  async clickOnSeen() {
    this.tabSelected = 'movies';

    this.type = 'seen';
    this.loading = true;
    this.onCloseMovieDetails();

    const seen = await Storage.readDB('movie');

    this.movies = Object.keys(seen)
      .map(movie => new Movie(seen[movie], seen));
    this.loading = false;
  }

  public onClickPoster(movie: Movie | MovieDetails, event) {
    if (event.ctrlKey || event.metaKey) {
      this.showMovieDetails ? this.movieDetails.toggleSeen(movie) : movie.toggleSeen(movie);
      movie.seen ? Storage.addKeyDB('movie', movie) : Storage.deleteKeyDB('movie', movie);
    } else {
      this.goToMovieDetails(movie);
    }
  }

  goToMovieDetails(movie: Movie) {
    if (this.movieDetails && this.movieDetails.id === movie.id) { return; }
    this.tabSelected = 'movieDetails';

    this.loading = true;
    if (movie.backdrop) {
      this.background.addBackground(`https://image.tmdb.org/t/p/w300${movie.backdrop}`);
    }

    this.tmdb.getMovieDetails(movie.id)
      .then((movieDetails) => {
        this.movieDetails = movieDetails;
        this.showMovieDetails = true;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  orderBy(key) {
    const order = this.orderAsc[key] ? 'asc' : 'desc';
    this.orderAsc[key] = !this.orderAsc[key];

    this.loading = true;
    this.movies = Utils.orderBy(this.movies, key, order);
    this.loading = false;
  }
}
