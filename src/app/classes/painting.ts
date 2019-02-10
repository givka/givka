import { IDataBasePainting } from '../interfaces/all';
import { Utils } from './utils';

export class Painting {
  public artistName: string;
  public artistUrl!: string;
  public image!: string;
  public imageLQ!: string;
  public title: string;
  public year!: string;
  public height: number;
  public width: number;
  public extension!: string;
  public id!: number;
  public seen!: boolean;

  constructor(options: any) {
    this.artistName = options.artistName;
    this.title = options.title;
    this.height = options.height;
    this.width = options.width;
  }

  public fromServer(options: any, database: IDataBasePainting) {
    this.id = options.contentId;
    this.artistUrl = Utils.formatArtistUrl(options.artistName);
    this.extension = this.getExtension(options.image);
    this.image = options.image.replace(`!Large.${this.extension}`, '');
    this.imageLQ = `${this.image}!Blog.${this.extension}`;
    this.year = options.year || options.completitionYear;
    this.seen = !!database[this.id];

    if (this.height < 500 && this.width < 500) {
      this.imageLQ = this.image;
    }

    return this;

  }

  public fromStorage(options: any) {
    this.id = options.id;
    this.artistUrl = options.artistUrl;
    this.extension = options.extension;
    this.image = options.image;
    this.imageLQ = `${this.image}!Blog.${this.extension}`;
    this.year = options.year || options.completitionYear;
    this.seen = true;

    if (this.height < 500 && this.width < 500) {
      this.imageLQ = this.image;
    }

    return this;
  }

  private getExtension(image: string) {
    return image.split('.').pop() || '';
  }

}
