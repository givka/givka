export class Painting {
  artistName: string;

  artistUrl: string;

  imageSmall: string;

  imageLarge: string;

  title: string;

  year: string;

  constructor(options) {
    this.artistName = options.artistName;
    this.artistUrl = options.artistUrl;
    this.imageSmall = options.image.concat('!Portrait.jpg');
    this.imageLarge = options.image;
    this.title = options.title;
    this.year = options.year;
  }
}
