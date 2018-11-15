import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { random } from 'lodash';

import { Movie } from '../factories/movie';
import { MovieDetails } from '../factories/movie-details';
import { Storage } from '../factories/storage';
import { Credit } from '../factories/credit';
import { Serie } from '../factories/serie';
import { SerieDetails } from '../factories/serie-details';

@Injectable({
  providedIn: 'root'
  })
export class TmdbService {
  private apiKey: string = 'aa79a25e783821b082e1e241e41889db';

  private basicUrl: string = 'https://api.themoviedb.org/3/';

  private language: string = 'en-US';

  constructor(private http: HttpClient) { }

  getMultiplePages(url) {
    const PromiseArray = [];

    for (let i = 1; i <= 10; i += 1) {
      PromiseArray.push(this.getRequest(url, null, i));
    }
    return Promise.all(PromiseArray)
      .then((allResponses) => {
        let results = allResponses.map(value => value.results);
        results = [].concat(...results);
        return Object.keys(results).map(key => results[key]);
      });
  }

  getDiscoverSeries(list) {
    const database = Storage.readDB('series');
    return this.getMultiplePages(`tv/${list}`)
      .then(data => data.map(m => new Serie(m, database)).filter(m => m.poster));
  }

  getDiscoverMovies(list) {
    const database = Storage.readDB('movies');
    return this.getMultiplePages(`movie/${list}`)
      .then(data => data.map(m => new Movie(m, database)).filter(m => m.poster));
  }

  async getMovieDetails(id: number) {
    if (!id) { return null; }

    const database = Storage.readDB('movies');
    const movieData = await this.getRequest(`movie/${id}`, 'credits,images,videos,recommendations');
    const movieDetails = new MovieDetails(movieData, database);

    const [directorMovies, collectionMovies] = await Promise.all([
      this.getPeople(movieDetails.director.id),
      this.getCollection(movieDetails.collection && movieDetails.collection.id),
    ]);

    movieDetails.addDetails(directorMovies, collectionMovies, database);
    return movieDetails;
  }

  async getSerieDetails(id: number) {
    if (!id) { return null; }

    const database = Storage.readDB('series');
    const serieData = await this.getRequest(`tv/${id}`, 'credits,images,videos,recommendations');
    const serieDetails = new SerieDetails(serieData, database);

    return serieDetails;
  }

  getCollection(id) {
    if (!id) { return null; }
    return this.getRequest(`collection/${id}`, 'images');
  }

  getPeople(id) {
    if (!id) { return null; }
    const databaseMovies = Storage.readDB('movies');
    const databaseSeries = Storage.readDB('series');
    return this.getRequest(`person/${id}`, 'movie_credits,images,tagged_images,tv_credits')
      .then(c => new Credit(c, databaseMovies, databaseSeries));
  }

  private getRequest(url: string, addRequestAppend: string, page: number = 1) {
    return this.http.get(this.basicUrl + url, {
      params: {
        language: this.language,
        api_key: this.apiKey,
        append_to_response: addRequestAppend,
        include_image_language: 'en,null',
        page: page.toString(),
      },
    }).toPromise();
  }
}
