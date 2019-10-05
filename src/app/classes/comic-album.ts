export class ComicAlbum {
  public serieId: number;
  public serieTitle: string;
  public albumId: number;
  public albumTitle: string;
  public imageCover: string;
  public imageCoverWidth: string;
  public imageCoverHeight: string;
  public imageExtract: string;
  public imageReverse: string;
  public voteAverage: number;
  public voteCount: number;
  public scenario: string;
  public drawing: string;
  public colors: string;
  public date: string;
  public editor: string;
  public nbrOfPages: number;
  public albumNumber: number;

  constructor(options: any) {
    this.serieId = options.serieId;
    this.serieTitle = options.serieTitle;
    this.albumId = options.albumId;
    this.albumTitle = options.albumTitle;
    this.imageCover = options.imageCover;
    this.imageCoverWidth = options.imageCoverWidth;
    this.imageCoverHeight = options.imageCoverHeight;
    this.imageExtract = options.imageExtract;
    this.imageReverse = options.imageReverse;
    this.voteAverage = options.voteAverage;
    this.voteCount = options.voteCount;
    this.scenario = options.scenario;
    this.drawing = options.drawing;
    this.colors = options.colors;
    this.date = options.date;
    this.editor = options.editor;
    this.nbrOfPages = options.nbrOfPages;
    this.albumNumber = options.albumNumber;
  }
}
