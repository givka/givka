import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RoutingStateService } from './services/routing-state.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class AppComponent implements OnInit {
  tabSelected: string = 'movies';

  constructor(private routingState: RoutingStateService) {

  }

  ngOnInit() {
    this.routingState.loadRouting();
  }
}
