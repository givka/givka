import { ComicAlbum } from './comic-album';

export class ComicAuthor{
  public name: string;
  public scenarioAlbums: ComicAlbum[];
  public drawingAlbums: ComicAlbum[];
  public colorsAlbums: ComicAlbum[];

  constructor(options: any) {
    const albums = options.albums.map((a:any) => new ComicAlbum(a)) as ComicAlbum[];
    this.name = options.name;
    this.scenarioAlbums = albums.filter(album => album.scenario === this.name);
    this.drawingAlbums = albums.filter(album => album.drawing === this.name);
    this.colorsAlbums = albums.filter(album => album.colors === this.name);
  }
}
