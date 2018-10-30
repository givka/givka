import { Painting } from './painting';
import { Utils } from './utils';

export class Artist {
  artistName: string;

  artistUrl: string;

  image: string;

  birthDate: string;

  deathDate: string;

  constructor(options) {
    this.artistName = options.artistName;
    this.artistUrl = options.url || Utils.formatArtistUrl(options.artistName);
    this.image = this.formatImage(options.image);
    this.birthDate = options.birthDayAsString;
    this.deathDate = options.deathDayAsString;
  }

  private formatImage(image: string) {
    if (image.includes('Content')) { return null; }
    const extension = image.split('.').pop();
    return image.replace(`!Portrait.${extension}`, '');
  }
}
