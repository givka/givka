const storage = require('electron-json-storage');

class JsonDataBase {
  static addKeyDB(key, obj) {
    return new Promise((resolve, reject) => {
      this.readDB(key)
        .then((data, err) => {
          if (err) { reject(err); }
          data[obj.id] = {
            id: obj.id,
            poster_path: obj.poster_path,
            title: obj.title,
            date: obj.release_date,

          };
          resolve(data);
          return this.writeDB(key, data);
        })
        .then((err) => {
          if (err) { reject(err); }
        });
    });
  }

  static deleteKeyDB(key, id) {
    return new Promise((reject) => {
      this.readDB(key)
        .then((data, err) => {
          if (err) { reject(err); }
          if (data[id] !== undefined) {
            delete data[id];
          }
          return this.writeDB(key, data);
        })
        .then((err) => {
          reject(err);
        });
    });
  }

  static readDB(key) {
    return new Promise((resolve, reject) => {
      storage.get(key, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  }

  static writeDB(key, obj) {
    return new Promise((reject) => {
      storage.set(key, obj, (error) => {
        if (error) { reject(error); }
      });
    });
  }

  static getAllKeys() {
    return new Promise((resolve, reject) => {
      storage.getAll((err, keys) => {
        if (err) { reject(err); }
        resolve(keys);
      });
    });
  }
}

module.exports = JsonDataBase;
