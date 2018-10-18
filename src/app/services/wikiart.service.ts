import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Painting } from '../factories/painting';

@Injectable({ providedIn: 'root' })
export class WikiartService {
  basicUrl: string = 'https://www.wikiart.org/en/'

  constructor(private http: HttpClient) { }

  getPopularPaintings(): any {
    const array = [];
    for (let page = 1; page < 10; page += 1) {
      array.push(this.getRequest('popular-paintings', page));
    }
    return Promise.all(array)
      .then((allResponses) => {
        let results = allResponses.map(value => value.Paintings);
        results = [].concat(...results);
        return results.map(painting => new Painting(painting));
      });
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
