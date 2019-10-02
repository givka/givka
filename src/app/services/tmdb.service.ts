import {HttpClient} from '@angular/common/http';

import {Injectable} from '@angular/core';
import {Credit} from '../classes/credit';
import {CreditDetails} from '../classes/credit-details';
import {Movie} from '../classes/movie';
import {MovieDetails} from '../classes/movie-details';
import {Serie} from '../classes/serie';
import {SerieDetails} from '../classes/serie-details';
import {Storage} from '../classes/storage';

@Injectable({
  providedIn: 'root',
})

export class TmdbService {
  private readonly apiKey: string = 'aa79a25e783821b082e1e241e41889db';

  private readonly basicUrl: string = 'https://api.themoviedb.org/3/';

  private readonly language: string = 'en-US';

  constructor(private http: HttpClient) {
  }

  public getMultiplePages(url: string, offsetPages = 0, nbrOfPages = 5) {
    const promises = Array.from(Array(nbrOfPages))
      .map((value, index) => this.getRequest(url, '', index + 1 + offsetPages));

    return Promise.all(promises)
      .then((allResponses) => {
        let results = allResponses.map((value: any) => value.results);
        results = [].concat(...results);
        return Object.keys(results).map((key: string) => results[parseInt(key, 10)]);
      });
  }

  public getDiscoverSeries(list: string, offsetPages = 0, nbrOfPages = 5) {
    const database = Storage.readDB('series');
    return this.getMultiplePages(`tv/${list}`, offsetPages, nbrOfPages)
      .then(results => results
        .map(result => new Serie().fromServer(result, database)).filter(serie => serie.poster));
  }

  public getDiscoverMovies(list: string, offsetPages = 0, nbrOfPages = 5) {
    const database = Storage.readDB('movies');
    return this.getMultiplePages(`movie/${list}`, offsetPages, nbrOfPages)
      .then(results => results
        .map(result => new Movie().fromServer(result, database)).filter(movie => movie.poster));
  }

  public async getMovieDetails(id: number) {
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

  public getSearch(query: string, toExclude: string) {
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

  public async getSerieDetails(id: number) {
    const database = Storage.readDB('series');
    const serieData = await this.getRequest(`tv/${id}`, 'credits,images,videos,recommendations');
    const serieDetails = new SerieDetails(serieData, database);

    return serieDetails;
  }

  public getCollection(id: number) {
    return this.getRequest(`collection/${id}`);
  }

  public getPeople(id: number) {
    const databaseMovies = Storage.readDB('movies');
    const databaseSeries = Storage.readDB('series');
    return this.getRequest(`person/${id}`, 'movie_credits,images,tagged_images,tv_credits')
      .then(c => new CreditDetails(c, databaseMovies, databaseSeries));
  }

  private getRequest(url: string, addRequestAppend = '', page: number = 1): Promise<any> {
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
