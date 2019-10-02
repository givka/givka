import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {ComicAlbum} from '../classes/comic-album';
import {ComicAuthor} from '../classes/comic-author';
import {ComicSerie} from '../classes/comic-serie';
import {ComicSerieDetails} from '../classes/comic-serie-details';

@Injectable({
  providedIn: 'root',
})
export class ComicsService {

  private readonly baseUrl = 'https://givka-api.netlify.com/.netlify/functions/';
  private cache = new Map();

  constructor(private http: HttpClient) {
  }

  public getAlbums() {
    return this.http.get(`${this.baseUrl}read-all?class=albums&order=voteCount`)
      .toPromise()
      .then((response: any) => response.map((a: any) => new ComicAlbum(a)) as ComicAlbum[]);
  }

  public getSeries(after: number | null): Promise<{ after: number, series: ComicSerie[] }> {
    const url = `${this.baseUrl}read-all?class=series&order=voteCount${
      after ? `&after=${after}` : ''}`;

    const seriesCache = this.cache.get(url);
    if (seriesCache) {
      return of(seriesCache).toPromise();
    }

    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const result = {
          after: response.after,
          series: response.series.map((s: any) => new ComicSerie(s)) as ComicSerie[],
        };
        this.cache.set(url, result);
        return result;
      });

  }

  public getSerieDetails(id: number) {
    return this.http.get(`${this.baseUrl}read-serie?serieId=${id}`)
      .toPromise()
      .then(response => new ComicSerieDetails(response));
  }

  public getAuthor(name: string) {
    return this.http.get(`${this.baseUrl}read-author?name=${name}`)
      .toPromise()
      .then((response: any) => new ComicAuthor(response));
  }

}
