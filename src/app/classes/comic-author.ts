import { ComicAlbum } from './comic-album';

export class ComicAuthor{
  public name: string;
  public bothAlbums: ComicAlbum[];
  public scenarioAlbums: ComicAlbum[];
  public drawingAlbums: ComicAlbum[];

  constructor(options: any) {
    const albums = options.albums.map((a:any) => new ComicAlbum(a)) as ComicAlbum[];
    this.name = options.name;
    this.bothAlbums = albums.filter(album => album.scenario === this.name &&
                                             album.drawing === this.name);
    this.scenarioAlbums = albums.filter(album => album.scenario === this.name &&
                                                 album.drawing !== this.name);
    this.drawingAlbums = albums.filter(album => album.drawing === this.name &&
                                                album.scenario !== this.name);
  }
}
