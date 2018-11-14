import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';
import { TmdbService } from 'src/app/services/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutingStateService } from 'src/app/services/routing-state.service';
import { Title } from '@angular/platform-browser';
import { Background } from 'src/app/factories/background';
import { MovieDetails } from '../../../factories/movie-details';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'movie-details-component',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movie: MovieDetails;

  loading = true;

  subRouter: Subscription;

  subMovie: Subscription;

  background: Background = new Background();

  constructor(
    private broadcast: BroadcastService,
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private routingState: RoutingStateService,
    private title: Title,
  ) {
  }

  ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { id } = routeParams;
      this.loadMovieDetails(+id);
    });
    this.subMovie = this.broadcast.getMovie()
      .subscribe((subject) => {
        this.movie.toggleSeen(subject.movie);
      });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
    this.subMovie.unsubscribe();
    this.background.removeBackground();
  }

  loadMovieDetails(id: number) {
    this.loading = true;
    this.tmdb.getMovieDetails(id)
      .then((movieDetails) => {
        this.background.addBackground(`https://image.tmdb.org/t/p/w300${movieDetails.backdrop}`);
        this.movie = movieDetails;
        this.title.setTitle(movieDetails.title);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onClickCredit(credit) {
    this.router.navigate([`/credit/${credit.id}`]);
  }

  close() {
    this.router.navigate([this.routingState.getMoviesLastUrl()]);
  }
}
