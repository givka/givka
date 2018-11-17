import { Injectable } from '@angular/core';
import { random } from 'lodash';

@Injectable({
  providedIn: 'root'
  })
export class BackgroundService {
  private styleSheet: any;

  private ruleAdded: boolean;

  private background : string;

  constructor() {
    this.styleSheet = this.initStyleSheet();
    this.ruleAdded = false;
  }

  private initStyleSheet() {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    return styleEl.sheet;
  }

  private getImage(url) {
    return new Promise(((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        resolve(url);
      };
      img.onerror = function () {
        reject(url);
      };
      img.src = url;
    }));
  }

  public async addBackground(image) {
    if (image === this.background) { return; }

    this.background = image;
    await this.getImage(image);

    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
    } else {
      this.ruleAdded = true;
    }
    const background = `url(${image})`;
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
}

