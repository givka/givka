import { Utils } from './utils';

export class Painting {
  artistName: string;

  artistUrl: string;

  image: string;

  title: string;

  year: string;

  height: number;

  extension: string;

  id: number;

  seen: boolean;

  constructor(options, paintingsSeen) {
    this.id = options.contentId;
    this.artistName = options.artistName;
    this.artistUrl = Utils.formatArtistUrl(options.artistName);
    this.extension = this.getExtension(options.image);
    this.image = options.image.replace(`!Large.${this.extension}`, '');
    this.title = options.title;
    this.year = options.year || options.completitionYear;
    this.height = options.height;
    this.seen = !!paintingsSeen[this.id];
  }

  private getExtension(image: string) {
    return image.split('.').pop();
  }
}
