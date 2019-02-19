export class ComicSerie{
  public serieTitle: string;
  public serieId: number;
  public voteAverage: number;
  public voteCount: number;
  public numberOfAlbums: number;
  public serieCover: string;

  constructor(options: any) {
    this.serieTitle = options.serieTitle;
    this.serieId = options.serieId;
    this.voteAverage = options.voteAverage;
    this.voteCount = options.voteCount;
    this.numberOfAlbums = options.numberOfAlbums;
    this.serieCover = options.serieCover;

  }
}
