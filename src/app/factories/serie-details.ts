import { TmdbDetails } from './tmdb-details';
import { Serie } from './serie';
import { Utils } from './utils';
import { Credit } from './credit';

export class SerieDetails extends TmdbDetails {
  public numberOfSeasons: number;

  public numberOfEpisodes: number;

  public recoSeries: Serie[];

  public seasons;

  public creator;

  public originalTitle;

  constructor(options, database) {
    super(options, database);
    this.originalTitle = options.original_name;
    this.numberOfSeasons = options.number_of_seasons;
    this.numberOfEpisodes = options.number_of_episodes;
    this.seasons = this.formatSeasons(options.seasons);
    this.creator = this.formatCreator(options.created_by);
    this.credits = [this.creator].concat(this.credits);
    this.recoSeries = this.formatRecoSeries(options.recommendations, database);
  }

  private formatCreator(creators) {
    const creator = new Credit().fromCast(creators[0]) || this.credits[0];
    creator.role = 'Creator';
    return creator;
  }

  public toggleListSeen(serie: Serie) {
    [].concat(this, this.recoSeries)
      .filter(s => s && s.id === serie.id)
      .forEach((s) => { s.seen = !s.seen; });
  }

  private formatSeasons(seasons) {
    return seasons.filter(s => s.season_number !== 0).map(season => ({
      id: season.id,
      name: season.name,
      poster: season.poster_path,
      releaseDate: season.air_date,
    }));
  }

  private formatRecoSeries(recoSeries, database) {
    return recoSeries.results.map(serie => new Serie().fromServer(serie, database));
  }
}
