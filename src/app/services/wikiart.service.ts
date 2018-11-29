import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shuffle } from 'lodash';
import { Painting } from '../factories/painting';
import { Artist } from '../factories/artist';
import { ArtistDetails } from '../factories/artist-details';
import { Storage } from '../factories/storage';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  API: string = 'https://givka-api.herokuapp.com/https://www.wikiart.org/en/';

  constructor(private http: HttpClient) { }

  getMostViewedPaintings() {
    const paintingsSeen = Storage.readDB('art');
    return this.getRequest('App/Painting/MostViewedPaintings')
      .then(result => shuffle(result.map(p => new Painting(p, paintingsSeen))));
  }

  getSearch(query: string) {
    const paintingsSeen = Storage.readDB('art');
    return this.getRequest(`search/${query}/1`)
      .then(result => result.map(p => new Painting(p, paintingsSeen)));
  }

  getPopularArtists() {
    return this.getRequest('app/api/popularartists')
      .then(data => shuffle(data.map(a => new Artist(a))));
  }

  getArtistDetails(artistUrl: string) {
    const paintingsSeen = Storage.readDB('art');
    return Promise.all([
      this.getRequest(artistUrl),
      this.getRequest(`App/Painting/PaintingsByArtist?artistUrl=${artistUrl}`),
    ]).then(([details, paintings]) => new ArtistDetails(details, paintings, paintingsSeen));
  }

  private getRequest(url: string, page: number = 1): any {
    return this.http.get(this.API + url, {
      params: {
        json: '2',
        page: page.toString(),
      },
    }).toPromise();
  }

  private getWikiRequest(wikiUrl) {
    return this.http.get(wikiUrl).toPromise();
  }
}
