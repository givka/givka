import { IDataBasePainting } from '../interfaces/all';
import { Artist } from './artist';
import { Painting } from './painting';

export class ArtistDetails extends Artist {
  public paintings: Painting[];
  public wikipediaUrl: string;
  public biography: string;
  public careerStart: number;
  public careerEnd: number;
  public originalName: string;

  constructor(options: any, paintings = [], database: IDataBasePainting) {
    super(options);
    this.wikipediaUrl = options.wikipediaUrl;
    this.biography = options.biography;
    this.careerStart = options.activeYearsStart;
    this.careerEnd = options.activeYearsCompletion;
    this.originalName = options.OriginalArtistName;
    this.paintings = paintings.map(p => new Painting(p, database));
  }
}
