const storage = require('electron-json-storage');

class DataBase {
  addKeyDB(key, obj) {
    return new Promise((resolve, reject) => {
      this.readDB(key)
        .then((data, err) => {
          if (err) { reject(err); }
          data[obj.id] = obj;
          resolve(data);
          return this.writeDB(key, data);
        })
        .then((err) => {
          if (err) { reject(err); }
        });
    });
  }

  deleteKeyDB(key, id) {
    return new Promise((reject) => {
      this.readDB(key)
        .then((data, err) => {
          if (err) { reject(err); }
          console.log('before', data);
          delete data[id];
          console.log('after', data);
          return this.writeDB(key, data);
        })
        .then((err) => {
          reject(err);
        });
    });
  }

  readDB(key) {
    return new Promise((resolve, reject) => {
      storage.get(key, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  }

  writeDB(key, obj) {
    return new Promise((reject) => {
      storage.set(key, obj, (error) => {
        if (error) { reject(error); }
      });
    });
  }

  getAllKeys() {
    return new Promise((resolve, reject) => {
      storage.getAll((err, keys) => {
        if (err) { reject(err); }
        resolve(keys);
      });
    });
  }
}

module.exports = DataBase;
