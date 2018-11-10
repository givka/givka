import { random } from 'lodash';

export class Background {
  styleSheet: any;

  ruleAdded: boolean;

  constructor() {
    this.styleSheet = this.initStyleSheet();
    this.ruleAdded = false;
  }

  private initStyleSheet() {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    return styleEl.sheet;
  }

  getImage(url) {
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

  async addBackground(image) {
    await this.getImage(image);

    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
    } else {
      this.ruleAdded = true;
    }
    const background = `url(${image})`;
    const rule = `.main-content::before {
    background-image: ${background} !important;
    transform: scale(${random(1.1, 1.5, true)}) !important;
  }`;
    this.styleSheet.insertRule(rule, 0);
  }

  removeBackground() {
    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
      this.ruleAdded = false;
    }
  }
}

