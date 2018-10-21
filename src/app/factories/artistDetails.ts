import { Artist } from './artist';
import { Painting } from './painting';

export class ArtistDetails extends Artist {
  paintings: Painting[];

  wikipediaUrl: string;

  biography: string;

  careerStart: number;

  careerEnd: number;

  constructor(options, paintings = []) {
    super(options);
    this.wikipediaUrl = options.wikipediaUrl;
    this.biography = options.biography;
    this.careerStart = options.activeYearsStart;
    this.careerEnd = options.activeYearsCompletion;
    this.paintings = paintings.map(p => new Painting(p));
  }
}
