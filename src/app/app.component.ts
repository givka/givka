import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ElectronService } from './services/electron.service';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class AppComponent {
  tabSelected: string = 'movies';

  constructor(public electronService: ElectronService,
    private translate: TranslateService) {
    translate.setDefaultLang('en');
    // console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      // console.log('Mode electron');
      // console.log('Electron ipcRenderer', electronService.ipcRenderer);
      // console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  onClickTab(tab) {
    this.tabSelected = tab;
  }
}
