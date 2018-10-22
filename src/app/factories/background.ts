import Jimp from 'jimp/es';

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

  async addBackground(image) {
    const blur = await this.blurBase64URI(image, 3);

    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
    } else {
      this.ruleAdded = true;
    }
    const background = `url(${blur})`;
    const rule = `.main-content::before {
    z-index: -1 !important;
    content: ' ' !important;
    position: fixed !important;
    background-image: ${background} !important;
    background-size: cover !important; 
    will-change: transform !important;
    transform: scale(1) !important;
  }`;
    this.styleSheet.insertRule(rule, 0);
  }

  removeBackground() {
    if (this.ruleAdded) {
      this.styleSheet.deleteRule(0);
      this.ruleAdded = false;
    }
  }

  private blurBase64URI(bgImg, pixels) {
    return new Promise((resolve, reject) => {
      Jimp.read(bgImg)
        .then((image) => {
          image.color([{ apply: 'shade', params: [50] }])
            .blur(pixels)
            .getBase64(Jimp.AUTO, (err, encoded) => {
              resolve(encoded);
              reject(err);
            });
        });
    });
  }
}

