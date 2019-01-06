import { IDataBasePainting } from '../interfaces/all';
import { Utils } from './utils';

export class Painting {
  public artistName: string;
  public artistUrl: string;
  public image: string;
  public title: string;
  public year: string;
  public height: number;
  public width: number;
  public extension: string;
  public id: number;
  public seen: boolean;

  constructor(options: any, database: IDataBasePainting) {
    this.id = options.contentId;
    this.artistName = options.artistName;
    this.artistUrl = Utils.formatArtistUrl(options.artistName);
    this.extension = this.getExtension(options.image);
    this.image = options.image.replace(`!Large.${this.extension}`, '');
    this.title = options.title;
    this.year = options.year || options.completitionYear;
    this.height = options.height;
    this.width = options.width;
    this.seen = !!database[this.id];
  }

  private getExtension(image: string) {
    return image.split('.').pop() || '';
  }
}
