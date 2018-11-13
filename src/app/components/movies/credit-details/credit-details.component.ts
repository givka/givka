import {
  Component, Input, OnInit, ViewEncapsulation,
} from '@angular/core';
import { MovieDetails } from '../../../factories/movie-details';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'credit-details-component',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class CreditDetailsComponent implements OnInit {
  @Input() credit

  constructor(private broadcast: BroadcastService) {

  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onClickCredit(credit, event) {
    this.broadcast.sendCredit(credit, event);
  }
}
