import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shuffle } from 'lodash';
import { of } from 'rxjs';
import { Artist } from '../classes/artist';
import { ArtistDetails } from '../classes/artist-details';
import { Painting } from '../classes/painting';
import { Storage } from '../classes/storage';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  private readonly proxyUrl = 'https://givka-api.netlify.com/.netlify/functions/proxy';
  private readonly baseUrl = 'https://www.wikiart.org/';
  private cache = new Map();

  constructor(private http: HttpClient) { }

  public getMostViewedPaintings(page: number = 1): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequestCached(`?json=2&layout=new&param=featured&layout=new&page=${page}`)
      .then(result => shuffle(result.Paintings
        .map((p: any) => new Painting(p).fromServer(p, database))));
  }

  public getSearch(query: string): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequest(`search/${query}/1`)
      .then(result => result
        .map((p: any) => new Painting(p).fromServer(p, database)));
  }

  public getPopularArtists(): Promise<Artist[]> {
    return this.getRequestCached('app/api/popularartists')
      .then(data => shuffle(data.map((a: any) => new Artist(a))));
  }

  public getArtistDetails(artistUrl: string): Promise<ArtistDetails> {
    const database = Storage.readDB('art');
    return Promise.all([
      this.getRequest(artistUrl),
      this.getRequest(`App/Painting/PaintingsByArtist?artistUrl=${artistUrl}`),
    ]).then(([details, paintings]) => new ArtistDetails(details, paintings, database));
  }

  private getRequest(url: string): Promise<any> {
    return this.http.post(this.proxyUrl, `${this.baseUrl}${url}`).toPromise()
      .then((result) => {
        this.cache.set(`${this.baseUrl}${url}`, result);
        return result;
      });
  }

  private getRequestCached(url: string): Promise<any> {
    const cachedRequest = this.cache.get(`${this.baseUrl}${url}`);
    return cachedRequest
      ? of(cachedRequest).toPromise()
      : this.getRequest(url);
  }
}
