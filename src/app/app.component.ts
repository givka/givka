import { Component, ViewEncapsulation } from '@angular/core';

import { ElectronService } from './services/electron.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class AppComponent {
  tabSelected: string = 'movies';

  constructor(public electronService: ElectronService) {
  }

  onClickTab(tab: string) {
    this.tabSelected = null;
    setTimeout(() => {
      this.tabSelected = tab;
    });
  }
}
