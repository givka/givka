import {
  Component, OnDestroy, OnInit, ViewEncapsulation,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreditDetails } from '../../../classes/credit-details';
import { RoutingStateService } from '../../../services/routing-state.service';
import { TmdbService } from '../../../services/tmdb.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'credit-details-component',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreditDetailsComponent implements OnInit, OnDestroy {
  public credit!: CreditDetails;
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
      this.loadCreditDetails(+id);
    });
  }

  public ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  public openNewTab(image: string) {
    window.open(`https://image.tmdb.org/t/p/original${image}`, '_blank');
  }

  public loadCreditDetails(id: number): void {
    this.loading = true;
    this.tmdb.getPeople(id)
      .then((credit) => {
        this.credit = credit;
        this.title.setTitle(credit.name);
      })
      .finally(() => { this.loading = false; });
  }

  public close() {
    this.router.navigate([this.routingState.getPreviousUrl()]);
  }
}
