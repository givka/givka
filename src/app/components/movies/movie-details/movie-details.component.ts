import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';
import { TmdbService } from 'src/app/services/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutingStateService } from 'src/app/services/routing-state.service';
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

  constructor(
    private broadcast: BroadcastService,
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private routingState: RoutingStateService,
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
  }

  loadMovieDetails(id: number) {
    this.loading = true;

    this.tmdb.getMovieDetails(id)
      .then((movieDetails) => {
        this.movie = movieDetails;
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
