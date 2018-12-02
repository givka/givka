import { Movie } from './movie';
import { Painting } from './painting';
import { Serie } from './serie';

export class Storage {
  public static readDB(key: string) {
    const database = localStorage.getItem(key);
    const db = database ? JSON.parse(database) : null;
    if (!db) {
      localStorage.setItem(key, JSON.stringify({}));
      return {};
    }
    return db;
  }

  public static writeDB(key: string, item: Movie | Painting | Serie) {
    return localStorage.setItem(key, JSON.stringify(item));
  }

  public static addKeyDB(key: string, item: Movie | Painting | Serie) {
    const data = this.readDB(key);
    data[item.id] = item;
    return this.writeDB(key, data);
  }

  public static deleteKeyDB(key: string, item: Movie | Painting | Serie) {
    const data = this.readDB(key);
    if (data[item.id] !== undefined) {
      delete data[item.id];
    }
    return this.writeDB(key, data);
  }
}
