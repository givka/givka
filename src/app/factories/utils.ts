import { orderBy } from 'lodash';

export class Utils {
  static orderBy(array, key, order = 'desc') {
    return orderBy(array, param => param[key], order);
  }

  static formatArtistUrl(artistName: string) {
    return artistName.toLowerCase()
      .replace(/\. /g, '-')
      .replace(/'/g, '-')
      .replace(/\./g, '-')
      .replace(/ /g, '-');
  }
}
