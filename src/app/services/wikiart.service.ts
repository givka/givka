import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {shuffle} from 'lodash';
import {of} from 'rxjs';
import {Artist} from '../classes/artist';
import {ArtistDetails} from '../classes/artist-details';
import {Painting} from '../classes/painting';
import {Storage} from '../classes/storage';

@Injectable({providedIn: 'root'})
export class WikiartService {
  private readonly proxyUrl = 'https://givka-api.netlify.com/.netlify/functions/proxy';
  private readonly baseUrl = 'https://www.wikiart.org/en/';
  private cache = new Map();

  constructor(private http: HttpClient) {
  }

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

  public getPopularArtists(page: number): Promise<Artist[]> {
    // tslint:disable-next-line: max-line-length
    return this.getRequestCached(`app/Search/ArtistAdvancedSearch/?isAjax=true&layout=new&layout=new&page=${page}`)
      .then(data => shuffle(data.Artists.map((a: any) => new Artist(a))));
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
