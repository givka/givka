import { IDataBaseSerie, ISeason } from '../interfaces/all';
import { Credit } from './credit';
import { Serie } from './serie';
import { TmdbDetails } from './tmdb-details';

export class SerieDetails extends TmdbDetails {
  public numberOfSeasons: number;
  public numberOfEpisodes: number;
  public recoSeries: Serie[];
  public seasons: ISeason[];
  public creator: Credit;

  constructor(options: any, database: IDataBaseSerie) {
    super(options, database);
    this.numberOfSeasons = options.number_of_seasons;
    this.numberOfEpisodes = options.number_of_episodes;
    this.seasons = this.formatSeasons(options);
    this.creator = this.formatCreator(options);
    this.credits = [this.creator].concat(this.credits);
    this.recoSeries = this.formatRecoSeries(options, database);
  }

  public toggleListSeen(serie: Serie) {
    Array.prototype.concat(this, this.recoSeries)
      .filter(s => s && s.id === serie.id)
      .forEach((s) => { s.seen = !s.seen; });
  }

  private formatCreator(options: any) {
    const creator = new Credit().fromCast(options.created_by[0]) || this.credits[0];
    creator.role = 'Creator';
    return creator;
  }

  private formatSeasons(options: any): ISeason[] {
    return options.seasons.filter((s: any) => s.season_number !== 0)
    .map((s: any) => ({
      id: s.id,
      name: s.name,
      poster: s.poster_path,
      releaseDate: s.air_date,
    }));
  }

  private formatRecoSeries(options: any, database: IDataBaseSerie) {
    return options.recommendations.results
      .map((serie: any) => new Serie().fromServer(serie, database));
  }
}
