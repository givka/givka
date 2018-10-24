import { Injectable } from '@angular/core';
import { Movie } from '../factories/movie';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage: Storage
  constructor() {
    this.storage = localStorage
  }

  readDB(key) {

    return JSON.parse(this.storage.getItem(key))
    // return new Promise((resolve, reject) => {
    //   this.storage.getItemp(key, (err, data) => {
    //     if (err) { reject(err); }
    //     resolve(data);
    //   });
    // });
  }

  writeDB(key, obj) {
    return this.storage.setItem(key, JSON.stringify(obj))
    // return new Promise((resolve, reject) => {
    //   this.storage.set(key, obj, (err) => {
    //     if (err) { reject(err); }
    //     resolve();
    //   });
    // });
  }

  async addKeyDB(key, movie: Movie) {
    const data = await this.readDB(key);
    data[movie.id] = movie;
    console.log('add', movie.title);
    return this.writeDB(key, data);
  }

  async deleteKeyDB(key, movie: Movie) {
    const data = await this.readDB(key);
    if (data[movie.id] !== undefined) {
      delete data[movie.id];
    }
    console.log('delete', movie.title);
    return this.writeDB(key, data);
  }
}
