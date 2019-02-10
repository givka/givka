import { Utils } from './utils';

export class Artist {
  public artistName: string;
  public artistUrl: string;
  public image: string | null;
  public imageLQ: string | null;
  public birthDate: string;
  public deathDate: string;
  public extension: string;

  constructor(options: any) {
    this.artistName = options.artistName;
    this.artistUrl = options.url || Utils.formatArtistUrl(options.artistName);
    this.extension = options.image.split('.').pop();
    this.image = this.formatImage(options.image);
    this.birthDate = options.birthDayAsString;
    this.deathDate = options.deathDayAsString;
    this.imageLQ = this.image ? `${this.image}!Blog.${this.extension}` : null;

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
