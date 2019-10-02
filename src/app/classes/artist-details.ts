import {IDataBasePainting} from '../interfaces/all';
import {Artist} from './artist';
import {Painting} from './painting';

export class ArtistDetails extends Artist {
  public paintings: Painting[];
  public wikipediaUrl: string;
  public biography: string;
  public careerStart: number;
  public careerEnd: number;
  public originalName: string;
  public birthDate: string;
  public deathDate: string;

  constructor(details: any, paintings: any, database: IDataBasePainting) {
    super(details);
    this.artistName = details.artistName;
    this.artistUrl = details.url;
    this.wikipediaUrl = details.wikipediaUrl;
    this.biography = details.biography;
    this.careerStart = details.activeYearsStart;
    this.careerEnd = details.activeYearsCompletion;
    this.originalName = details.OriginalArtistName;
    this.paintings = paintings.map((p: any) => new Painting(p).fromServer(p, database));
    this.birthDate = details.birthDayAsString;
    this.deathDate = details.deathDayAsString;
  }
}
