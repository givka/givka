import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RoutingStateService} from './services/routing-state.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public tabSelected = 'movies';

  constructor(private routingState: RoutingStateService) {

  }

  public ngOnInit() {
    this.routingState.loadRouting();
  }
}
