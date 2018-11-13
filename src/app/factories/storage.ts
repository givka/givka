export class Storage {
  static readDB(key) {
    const db = JSON.parse(localStorage.getItem(key));
    if (!db) {
      localStorage.setItem(key, JSON.stringify({}));
      return {};
    }
    return db;
  }

  static writeDB(key, obj) {
    return localStorage.setItem(key, JSON.stringify(obj));
  }

  static addKeyDB(key, movie) {
    const data = this.readDB(key);
    data[movie.id] = movie;
    return this.writeDB(key, data);
  }

  static deleteKeyDB(key, movie) {
    const data = this.readDB(key);
    if (data[movie.id] !== undefined) {
      delete data[movie.id];
    }
    return this.writeDB(key, data);
  }
}
