import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../classes/artist';
import { ArtistDetails } from '../classes/artist-details';
import { Painting } from '../classes/painting';
import { Storage } from '../classes/storage';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  private readonly proxyUrl = 'https://givka-api.netlify.app/.netlify/functions/proxy';
  private readonly baseUrl = 'https://www.wikiart.org/en/';

  constructor(private http: HttpClient) {
  }

  public getMostViewedPaintings(param: string, page: number = 1): Promise<Painting[]> {
    const url = param == 'recently-added-artworks'
      ? `recently-added-artworks?json=2&layout=new&page=${page}`
      : `?json=2&layout=new&param=${param}&layout=new&page=${page}`;
    const database = Storage.readDB('art');
    return this.getRequest(url)
      .then(result => result.Paintings.map((p: any) => new Painting(p).fromServer(p, database)));
  }

  public getSearch(query: string): Promise<Painting[]> {
    const database = Storage.readDB('art');
    return this.getRequest(`search/${query}/1`)
      .then(result => result.map((p: any) => new Painting(p).fromServer(p, database)));
  }

  public getPopularArtists(page: number): Promise<Artist[]> {
    // tslint:disable-next-line: max-line-length
    return this.getRequest(`App/Search/popular-artists?json=3&layout=new&page=${page}`)
      .then(data => data.Artists.map((a: any) => new Artist(a)));
  }

  public getArtistPaintings(artistUrl: string, page: number): Promise<any> {
    if (page === 0) {
      // tslint:disable-next-line: max-line-length
      return Promise.all([this.getArtistPaintings(artistUrl, 1), this.getArtistPaintings(artistUrl, 2)])
        .then(([result1, result2]) => Array.prototype.concat(result1, result2));
    }
    // tslint:disable-next-line: max-line-length
    return this.getRequest(`${artistUrl.replace('en/', '')}/mode/all-paintings?json=2&layout=new&page=${page}&resultType=masonry`)
      .then(result => result.Paintings || []);
  }

  public getArtistDetails(artistUrl: string): Promise<ArtistDetails> {
    const database = Storage.readDB('art');
    return Promise.all([
      this.getRequest(`${artistUrl.replace('en/', '')}?json=2&layout=new&resultType=masonry`),
      // tslint:disable-next-line: max-line-length
      this.getArtistPaintings(artistUrl, 0),
    ])
      .then(([details, paintings]) => new ArtistDetails(details, paintings, database));
  }

  private getRequest(url: string): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    }
    return this.http.get(`${this.baseUrl}${url}`, options).toPromise();
  }
}
