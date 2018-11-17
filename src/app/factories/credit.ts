export class Credit {
  id: number;

  name: string;

  profile: string;

  role: string;

  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.profile = options.profile_path;
    this.role = options.job || options.character;
  }
}
