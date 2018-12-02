import { Injectable } from '@angular/core';
import { random } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private styleSheet: any;

  private ruleAdded: boolean;

  private background!: string | null;

  constructor() {
    this.styleSheet = this.initStyleSheet();
    this.ruleAdded = false;
  }

  public async addBackground(imageUrl: string) {
    if (imageUrl === this.background) { return; }

    this.background = imageUrl;
    await this.getImage(imageUrl);

    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
    } else {
      this.ruleAdded = true;
    }
    const background = `url(${imageUrl})`;
    const rule = `.main-content::before {
    filter: blur(10px) brightness(0.5)!important;
    background-image: ${background} !important;
    transform: scale(${random(1.1, 1.5, true)}) !important;}`;
    this.styleSheet.insertRule(rule, 0);
  }

  public removeBackground() {
    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
      this.ruleAdded = false;
      this.background = null;
    }
  }

  private initStyleSheet() {
    const styleEl = document.createElement('style');
    document.head!.appendChild(styleEl);
    return styleEl.sheet;
  }

  private getImage(url: string) {
    return new Promise(((resolve, reject) => {
      const img = new Image();
      img.onload =  () => { resolve(url); };
      img.onerror =  () => { reject(url); };
      img.src = url;
    }));
  }
}
