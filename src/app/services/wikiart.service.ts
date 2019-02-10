import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shuffle } from 'lodash';
import { Artist } from '../classes/artist';
import { ArtistDetails } from '../classes/artist-details';
import { Painting } from '../classes/painting';
import { Storage } from '../classes/storage';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  private readonly proxyUrl = 'https://givka-api.netlify.com/.netlify/functions/proxy';
  private readonly baseUrl = `${this.proxyUrl}?url=https://www.wikiart.org/en/`;

  constructor(private http: HttpClient) { }

  public getMostViewedPaintings(): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequest('App/Painting/MostViewedPaintings')
      .then(result => shuffle(result
        .map((p: any) => new Painting(p).fromServer(p, database))));
  }

  public getSearch(query: string): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequest(`search/${query}/1`)
      .then(result => result
        .map((p: any) => new Painting(p).fromServer(p, database)));
  }

  public getPopularArtists(): Promise<Artist[]> {
    return this.getRequest('app/api/popularartists')
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
    const reqUrl = `${this.baseUrl}${url}${url.includes('?') ? '&' : '?'}json=2`;
    return this.http.get(reqUrl).toPromise();
  }

  private getWikiRequest(wikiUrl: string) {
    return this.http.get(wikiUrl).toPromise();
  }
}
