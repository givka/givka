import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shuffle } from 'lodash';
import { Artist } from '../classes/artist';
import { ArtistDetails } from '../classes/artist-details';
import { Painting } from '../classes/painting';
import { Storage } from '../classes/storage';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  private readonly baseUrl = 'shttps://www.wikiart.org/en/';

  constructor(private http: HttpClient) { }

  public getMostViewedPaintings(): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequest('App/Painting/MostViewedPaintings')
      .then(result => shuffle(result.map((p: any) => new Painting(p, database))));
  }

  public getSearch(query: string): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequest(`search/${query}/1`)
      .then(result => result.map((p: any) => new Painting(p, database)));
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

  private getRequest(url: string, page: number = 1): Promise<any> {
    return this.http.get(this.baseUrl + url, {
      params: {
        json: '2',
        page: page.toString(),
      },
    }).toPromise();
  }

  private getWikiRequest(wikiUrl: string) {
    return this.http.get(wikiUrl).toPromise();
  }
}
