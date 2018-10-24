import { Utils } from './utils';

export class Painting {
  artistName: string;

  artistUrl: string;

  image: string;

  title: string;

  year: string;

  height: number

  constructor(options) {
    this.artistName = options.artistName;
    this.artistUrl = Utils.formatArtistUrl(options.artistName);
    this.image = options.image.replace('!Large.jpg', '');
    this.title = options.title;
    this.year = options.year || options.completitionYear;
    this.height = options.height;
  }
}
