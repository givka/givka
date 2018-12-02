import { orderBy } from 'lodash';

export class Utils {
  public static orderBy<T extends object>(array: T, key: string, order = 'desc') {
    return orderBy(array, (param: any) => param[key], order === 'desc' ? 'desc' : 'asc') as T;
  }

  public static formatArtistUrl(artistName: string) {
    return artistName.toLowerCase()
      .replace(/\. /g, '-')
      .replace(/'/g, '-')
      .replace(/\./g, '-')
      .replace(/ /g, '-');
  }
}
