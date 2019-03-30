import { Utils } from './utils';

export class Artist {
  public id: string;
  public nation: string;
  public artistName: string;
  public artistUrl: string;
  public image: string | null;
  public imageLQ: string | null;
  public year: string;
  public extension: string;
  public totalWorksTitle: string;

  constructor(options: any) {
    this.id = options.id;
    this.artistName = options.title;
    this.artistUrl = options.artistUrl;
    this.year = options.year;
    this.nation = options.nation;
    this.extension = options.image.split('.').pop();
    this.image = this.formatImage(options.image);
    this.imageLQ = this.image ? `${this.image}!Blog.${this.extension}` : null;
    this.totalWorksTitle = options.totalWorksTitle;

    this.imageLQ = this.image;

    if (this.image) {
      const img = new Image();
      img.onload =  () => {
        if (img.width < 500 && img.height < 500) {
          this.imageLQ = this.image;
        }
      };
      img.src = this.image;
    }
  }

  private formatImage(image: string) {
    if (image.includes('Content')) { return null; }
    return image.replace(`!Portrait.${this.extension}`, '');
  }
}
