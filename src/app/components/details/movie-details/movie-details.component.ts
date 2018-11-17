import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';
import { TmdbService } from 'src/app/services/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutingStateService } from 'src/app/services/routing-state.service';
import { Title } from '@angular/platform-browser';
import { Storage } from 'src/app/factories/storage';
import { BackgroundService } from 'src/app/services/background.service';
import { UtilityService } from 'src/app/services/utility.service';
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

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private routingState: RoutingStateService,
    private title: Title,
    private background: BackgroundService,
    public utility : UtilityService,
  ) {
  }

  ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { id } = routeParams;
      this.loadMovieDetails(+id);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
    // this.background.removeBackground();
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
