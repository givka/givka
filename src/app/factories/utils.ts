import { orderBy } from 'lodash';

export class Utils {
  static orderBy<T extends object>(array: T, key: string, order = 'desc') {
    return orderBy(array, (param: any) => param[key], order === 'desc' ? 'desc' :'asc') as T;
  }

  static formatArtistUrl(artistName: string) {
    return artistName.toLowerCase()
      .replace(/\. /g, '-')
      .replace(/'/g, '-')
      .replace(/\./g, '-')
      .replace(/ /g, '-');
  }
}
