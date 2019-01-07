export class Credit {
  public id!: number;
  public name!: string;
  public profile!: string;
  public role!: string;

  public fromCrew(options: any) {
    this.formatCredit(options);
    this.role = options.job;
    return this;
  }

  public fromCast(options: any) {
    this.formatCredit(options);
    this.role = options.character;
    return this;
  }

  public fromDetails(options: any) {
    this.formatCredit(options);
  }

  private formatCredit(options: any) {
    this.id = options.id;
    this.name = options.name;
    this.profile = options.profile_path;
  }

}
