import {
  Component, OnDestroy, OnInit, ViewEncapsulation,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieDetails } from '../../../classes/movie-details';
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
  public movieDetails!: MovieDetails;
  public loading = true;
  public subRouter!: Subscription;

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private routingState: RoutingStateService,
    private title: Title,
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

  public openNewTab(image: string) {
    window.open(`https://image.tmdb.org/t/p/original${image}`, '_blank');
  }

  public loadMovieDetails(id: number) {
    this.loading = true;
    this.tmdb.getMovieDetails(id)
      .then((movieDetails) => {
        this.movieDetails = movieDetails;
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
