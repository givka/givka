import { TmdbDetails } from './tmdb-details';
import { Serie } from './serie';
import { Utils } from './utils';

export class SerieDetails extends TmdbDetails {
  public numberOfSeasons: number;

  public numberOfEpisodes: number;

  public recoSeries: Serie[];

  public seasons;

  public creator;

  constructor(options, database) {
    super(options, database);
    this.numberOfSeasons = options.number_of_seasons;
    this.numberOfEpisodes = options.number_of_episodes;
    this.seasons = this.formatSeasons(options.seasons);
    [this.creator] = options.created_by.map((creator) => { creator.role = 'Creator'; return creator; });
    this.credits = [this.creator].concat(this.credits);
    this.recoSeries = this.formatRecoSeries(options.recommendations, database);
  }

  public toggleListSeriesSeen(serie: Serie) {
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
    return recoSeries.results.map(serie => new Serie(serie, database));
  }
}
