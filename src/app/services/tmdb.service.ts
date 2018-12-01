import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../factories/movie';
import { MovieDetails } from '../factories/movie-details';
import { Storage } from '../factories/storage';
import { CreditDetails } from '../factories/credit-details';
import { Serie } from '../factories/serie';
import { SerieDetails } from '../factories/serie-details';
import { Credit } from '../factories/credit';
import { SerieResult, MovieResult } from '../types/tmdb';

@Injectable({
  providedIn: 'root',
})

export class TmdbService {
  private readonly apiKey: string = 'aa79a25e783821b082e1e241e41889db';

  private readonly basicUrl: string = 'https://api.themoviedb.org/3/';

  private readonly language: string = 'en-US';

  constructor(private http: HttpClient) { }

  getMultiplePages(url: string, offsetPages = 0, nbrOfPages = 5) {
    const promises = Array.from(Array(nbrOfPages))
    .map((value, index) => this.getRequest(url, '', index + 1 + offsetPages));

    return Promise.all(promises)
      .then((allResponses) => {
        let results = allResponses.map((value: any) => value.results);
        results = [].concat(...results);
        return Object.keys(results).map((key: string) => results[parseInt(key, 10)]);
      });
  }

  getDiscoverSeries(list: string, offsetPages = 0, nbrOfPages = 5) {
    const database = Storage.readDB('series');
    return this.getMultiplePages(`tv/${list}`, offsetPages, nbrOfPages)
      .then((results: SerieResult[]) => results
        .map(result => new Serie().fromServer(result, database)).filter(serie => serie.poster));
  }

  getDiscoverMovies(list: string, offsetPages = 0, nbrOfPages = 5) {
    const database = Storage.readDB('movies');
    return this.getMultiplePages(`movie/${list}`, offsetPages, nbrOfPages)
      .then((results: MovieResult[]) => results
        .map(result => new Movie().fromServer(result, database)).filter(movie => movie.poster));
  }

  async getMovieDetails(id: number) {
    if (!id) { return null; }

    const database = Storage.readDB('movies');
    const movieData = await this.getRequest(`movie/${id}`, 'credits,images,videos,recommendations');
    const movieDetails = new MovieDetails(movieData, database);

    const [directorMovies, collectionMovies] = await Promise.all([
      movieDetails.director ?
      this.getPeople(movieDetails.director.id)
      : null,
      movieDetails.collection
      ? this.getCollection(movieDetails.collection.id)
      : null,
    ]);

    movieDetails.addDetails(directorMovies, collectionMovies, database);
    return movieDetails;
  }

  getSearch(query: string, toExclude: string) {
    const databaseMovies = Storage.readDB('movies');
    const databaseSeries = Storage.readDB('series');
    return this.getMultiplePages(`search/multi?query=${query}`)
      .then((data) => {

        const results = data
          .filter(r => r.media_type !== toExclude)
          .map(r => (r.media_type === 'movie'
          ? new Movie().fromServer(r, databaseMovies)
          : (r.media_type === 'tv'
            ? new Serie().fromServer(r, databaseSeries)
            : new Credit().fromCrew(r))))
          .filter(r => (r instanceof Credit && r.profile)
           || (r instanceof Movie && r.poster)
           || (r instanceof Serie && r.poster));

        return {
          credits: results.filter(r => r instanceof Credit),
          movies: results.filter(r => r instanceof Movie),
          series: results.filter(r => r instanceof Serie),
        };
      });
  }

  async getSerieDetails(id: number) {
    if (!id) { return null; }

    const database = Storage.readDB('series');
    const serieData = await this.getRequest(`tv/${id}`, 'credits,images,videos,recommendations');
    const serieDetails = new SerieDetails(serieData, database);

    return serieDetails;
  }

  getCollection(id: number) {
    return this.getRequest(`collection/${id}`);
  }

  getPeople(id: number) {
    if (!id) { return null; }
    const databaseMovies = Storage.readDB('movies');
    const databaseSeries = Storage.readDB('series');
    return this.getRequest(`person/${id}`, 'movie_credits,images,tagged_images,tv_credits')
      .then(c => new CreditDetails(c, databaseMovies, databaseSeries));
  }

  private getRequest(url: string, addRequestAppend = '', page: number = 1) : Promise<any> {
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
