import { ComicAlbum } from './comic-album';
import { ComicSerie } from './comic-serie';

export class ComicSerieDetails extends ComicSerie {
  public albums: ComicAlbum[];
  public recommendations: ComicSerie[];

  constructor(options: any) {
    super(options);
    this.albums = options.albums.map((a: any) => new ComicAlbum(a));
    this.recommendations = options.recommendations.map((a: any) => new ComicSerie(a));
  }
}
