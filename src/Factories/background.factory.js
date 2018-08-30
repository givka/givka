angular.module('givka')
  .factory('BackgroundFactory', () => {
    class BackgroundFactory {
      constructor() {
        this.styleSheet = this._initStyleSheet();
        this.ruleAdded = false;
      }

      _initStyleSheet() {
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        return styleEl.sheet;
      }

      async addBackground(image) {
        const bgImg = `https://image.tmdb.org/t/p/w300${image}`;

        const blur = await this._blurBase64URI(bgImg, 3);

        if (this.ruleAdded) {
          this.styleSheet.deleteRule(0);
        }
        else {
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

      _blurBase64URI(bgImg, pixels) {
        return new Promise((resolve) => {
          Jimp.read(bgImg)
            .then((image) => {
              image.color([{ apply: 'shade', params: [70] }])
                .blur(pixels)
                .getBase64(Jimp.AUTO, (err, encoded) => {
                  resolve(encoded);
                });
            });
        });
      }
    }

    return BackgroundFactory;
  });
