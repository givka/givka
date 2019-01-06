import { ComicAlbum } from './comic-album';

export class ComicSerie{
  public serieTitle: string;
  public serieId: number;
  public albums : ComicAlbum[];
  public voteAverage: number;
  public voteCount: number;

  constructor(options: any) {
    this.serieTitle = options.serieTitle;
    this.serieId = options.serieId;
    this.albums = options.albums.map((a: any) => new ComicAlbum(a));
    this.voteAverage = options.voteAverage;
    this.voteCount = options.voteCount;
  }
}
