const storage = require('electron-json-storage');

angular.module('givka')
  .service('StorageService', ['$q', class StorageService {
    constructor($q) {
      this.$q = $q;
      this.path = null;
    }

    readDB(key) {
      const defer = this.$q.defer();
      storage.get(key, (err, data) => {
        if (err) { defer.reject(err); }
        defer.resolve(data);
      });
      return defer.promise;
    }

    writeDB(key, obj) {
      const defer = this.$q.defer();
      storage.set(key, obj, (err) => {
        if (err) { defer.reject(err); }
        defer.resolve();
      });
      return defer.promise;
    }

    addKeyDB(key, obj) {
      return this.readDB(key)
        .then((data) => {
          data[obj.id] = {
            id: obj.id,
            poster_path: obj.poster_path,
            title: obj.title,
            date: obj.release_date,
            backdrop_path: obj.backdrop_path,
          };
          return this.writeDB(key, data);
        });
    }

    deleteKeyDB(key, id) {
      return this.readDB(key)
        .then((data) => {
          if (data[id] !== undefined) {
            delete data[id];
          }
          return this.writeDB(key, data);
        });
    }

    getAllKeys() {
      const defer = this.$q.defer();
      storage.getAll((err, keys) => {
        if (err) { defer.reject(err); }
        defer.resolve(keys);
      });
      return defer.promise;
    }
  }]);
