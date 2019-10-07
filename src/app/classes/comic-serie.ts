import * as moment from 'moment';

export class ComicSerie {
  public serieTitle: string;
  public serieId: number;
  public voteAverage: number;
  public voteCount: number;
  public numberOfAlbums: number;
  public serieCover: string;
  public serieCoverWidth: string;
  public serieCoverHeight: string;
  public dateBegin: number;
  public dateEnd: number;

  constructor(options: any) {
    this.serieTitle = options.serieTitle;
    this.serieId = options.serieId;
    this.voteAverage = options.voteAverage;
    this.voteCount = options.voteCount;
    this.numberOfAlbums = options.numberOfAlbums;
    this.serieCover = options.serieCover;
    this.serieCoverWidth = options.serieCoverWidth;
    this.serieCoverHeight = options.serieCoverHeight;
    this.dateBegin = parseInt(moment.unix(options.dateBegin).format("YYYY"));
    this.dateEnd = parseInt(moment.unix(options.dateEnd).format("YYYY"));
  }
}
