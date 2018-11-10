import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { random } from 'lodash';

import { Movie } from '../factories/movie';
import { MovieDetails } from '../factories/movie-details';
import { Storage } from '../factories/storage';

@Injectable({
  providedIn: 'root'
  })
export class TmdbService {
  private apiKey: string = 'aa79a25e783821b082e1e241e41889db';

  private basicUrl: string = 'https://api.themoviedb.org/3/';

  private language: string = 'en-US';

  constructor(private http: HttpClient) { }

  getDiscover(list) {
    if (!list) { return null; }

    const database = Storage.readDB('movie');

    const url = `movie/${list}`;
    const PromiseArray = [];

    for (let i = 1; i <= 10; i += 1) {
      PromiseArray.push(this.getRequest(url, null, i));
    }
    return Promise.all(PromiseArray)
      .then((allResponses) => {
        let results = allResponses.map(value => value.results);
        results = [].concat(...results);
        return Object.keys(results).map(key => results[key]);
      })
      .then(data => data.map(m => new Movie(m, database)).filter(m => m.poster));
  }

  async getMovieDetails(id: number) {
    if (!id) { return null; }

    const [movieData, watchedMovies] = await Promise.all([
      this.getRequest(`movie/${id}`, 'credits,images,videos,recommendations'),
      Storage.readDB('movie'),
    ]);

    const movieDetails = new MovieDetails(movieData, watchedMovies);

    const [directorMovies, collectionMovies] = await Promise.all([
      this.getPeople(movieDetails.directorId),
      this.getCollection(movieDetails.collection && movieDetails.collection.id),
    ]);

    movieDetails.addDetails(directorMovies, collectionMovies, watchedMovies);

    return movieDetails;
  }

  getCollection(id) {
    if (!id) { return null; }
    return this.getRequest(`collection/${id}`, 'images');
  }

  getPeople(id) {
    if (!id) { return null; }
    return this.getRequest(`person/${id}`, 'movie_credits,images,tagged_images');
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
