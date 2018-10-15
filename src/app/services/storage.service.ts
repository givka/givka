import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Movie } from '../factories/movie';

@Injectable({
  providedIn: 'root'
  })
export class StorageService {
  constructor(private electron: ElectronService) { }

  readDB(key) {
    return new Promise((resolve, reject) => {
      this.electron.storage.get(key, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      });
    });
  }

  writeDB(key, obj) {
    return new Promise((resolve, reject) => {
      this.electron.storage.set(key, obj, (err) => {
        if (err) { reject(err); }
        resolve();
      });
    });
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
