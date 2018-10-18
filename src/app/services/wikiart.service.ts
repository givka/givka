import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Painting } from '../factories/painting';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  basicUrl: string = 'https://www.wikiart.org/en/'

  constructor(private http: HttpClient) { }

  getPopularPaintings(page): any {
    return this.getRequest('popular-paintings', page)
      .then(data => data.Paintings.map(painting => new Painting(painting)));
  }

  private getRequest(url: string, page: number = 1): any {
    return this.http.get(this.basicUrl + url, {
      params: {
        json: '2',
        page: page.toString(),
      },
    }).toPromise();
  }

  // popular-paintings?json=2&page=1
}
