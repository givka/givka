import {
  Component, OnDestroy, OnInit, ViewEncapsulation,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieDetails } from '../../../classes/movie-details';
import { BackgroundService } from '../../../services/background.service';
import { RoutingStateService } from '../../../services/routing-state.service';
import { TmdbService } from '../../../services/tmdb.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'movie-details-component',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  public movie!: MovieDetails;

  public loading = true;

  public subRouter!: Subscription;

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

  public ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { id } = routeParams;
      this.loadMovieDetails(+id);
    });
  }

  public ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  public loadMovieDetails(id: number) {
    this.loading = true;
    this.tmdb.getMovieDetails(id)
      .then((movieDetails) => {
        if (movieDetails.backdrop) {
          this.background.addBackground(`https://image.tmdb.org/t/p/w300${movieDetails.backdrop}`);
        }
        this.movie = movieDetails;
        this.title.setTitle(movieDetails.title);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public close() {
    this.router.navigate([this.routingState.getMoviesLastUrl()]);
  }
}
