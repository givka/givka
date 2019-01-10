import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SerieDetails } from '../../../classes/serie-details';
import { ISeason } from '../../../interfaces/all';
import { BackgroundService } from '../../../services/background.service';
import { RoutingStateService } from '../../../services/routing-state.service';
import { TmdbService } from '../../../services/tmdb.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'serie-details-component',
  templateUrl: './serie-details.component.html',
  styleUrls: ['./serie-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SerieDetailsComponent implements OnInit {
  public serie!: SerieDetails;

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
  ) { }

  public ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { id } = routeParams;
      this.loadSerieDetails(+id);
    });
  }

  public ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  public onClickSeason(season: ISeason, event: KeyboardEvent) {
    // TODO: see season details
  }

  public loadSerieDetails(id: number) {
    this.loading = true;
    this.tmdb.getSerieDetails(id)
      .then((serieDetails) => {
        if (serieDetails.backdrop) {
          this.background.addBackground(`https://image.tmdb.org/t/p/w300${serieDetails.backdrop}`);
        }
        this.serie = serieDetails;
        this.title.setTitle(serieDetails.title);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public close() {
    this.router.navigate([this.routingState.getSeriesLastUrl()]);
  }
}
