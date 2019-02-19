import { ComicAlbum } from './comic-album';
import { ComicSerie } from './comic-serie';

export class ComicAuthor{
  public authorId: number;
  public name: string;
  public birthDate: string | null;
  public deathDate: string | null;
  public image: string;
  public seriesBoth: ComicSerie[];
  public seriesScenario: ComicSerie[];
  public seriesDrawing: ComicSerie[];

  constructor(options: any) {
    this.authorId = options.authorId;
    this.name = options.name;
    this.birthDate = options.birthDate;
    this.deathDate = options.deathDate;
    this.image = options.image;
    this.seriesBoth = options.seriesBoth.map((s:any) => new ComicSerie(s));
    this.seriesScenario = options.seriesScenario.map((s:any) => new ComicSerie(s));
    this.seriesDrawing = options.seriesDrawing.map((s:any) => new ComicSerie(s));
  }
}
