import { Utils } from './utils';

export class Artist {
  public artistName: string;

  public artistUrl: string;

  public image: string | null;

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
  }

  private formatImage(image: string) {
    if (image.includes('Content')) { return null; }
    return image.replace(`!Portrait.${this.extension}`, '');
  }
}
