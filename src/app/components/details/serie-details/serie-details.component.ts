import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SerieDetails } from '../../../classes/serie-details';
import { ISeason } from '../../../interfaces/all';
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
  public serieDetails!: SerieDetails;
  public loading = true;
  public subRouter!: Subscription;

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private routingState: RoutingStateService,
    private title: Title,
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

  public openNewTab(image: string) {
    window.open(`https://image.tmdb.org/t/p/original${image}`, '_blank');
  }

  public loadSerieDetails(id: number) {
    this.loading = true;
    this.tmdb.getSerieDetails(id)
      .then((serieDetails) => {
        this.serieDetails = serieDetails;
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
