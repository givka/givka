import {
  Component, Input, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Credit } from 'src/app/factories/credit';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutingStateService } from 'src/app/services/routing-state.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'credit-details-component',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class CreditDetailsComponent implements OnInit, OnDestroy {
  credit: Credit;

  loading = true;

  subRouter: Subscription

  constructor(
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
      this.loadCreditDetails(+id);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  loadCreditDetails(id: number): void {
    this.loading = true;
    this.tmdb.getPeople(id)
      .then((credit) => {
        this.credit = credit;
        this.title.setTitle(credit.name);
      })
      .finally(() => { this.loading = false; });
  }

  close() {
    this.router.navigate([this.routingState.getPreviousUrl()]);
  }
}
