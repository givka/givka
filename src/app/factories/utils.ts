import { orderBy } from 'lodash';

export class Utils {
  static orderBy(array, key, order = 'desc') {
    return orderBy(array, param => param[key], order);
  }
}
