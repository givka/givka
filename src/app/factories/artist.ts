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
    this.artistUrl = Utils.formatArtistUrl(options.artistName);
    this.image = options.image.replace('!Portrait.jpg', '');
    this.birthDate = options.birthDayAsString;
    this.deathDate = options.deathDayAsString;
  }
}
