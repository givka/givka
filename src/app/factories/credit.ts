import { CrewResult, CastResult } from '../types/tmdb';

export class Credit {
  id!: number;

  name!: string;

  profile!: string;

  role!: string;

  private formatCredit(options: CrewResult | CastResult) {
    this.id = options.id;
    this.name = options.name;
    this.profile = options.profile_path;
  }

  public fromCrew(options: CrewResult) {
    this.formatCredit(options);
    this.role = options.job;
    return this;
  }

  public fromCast(options: CastResult) {
    this.formatCredit(options);
    this.role = options.character;
    return this;
  }

  public fromDetails(options: CastResult) {
    this.formatCredit(options);
  }

}
