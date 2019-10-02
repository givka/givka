import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {findLast} from 'lodash';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoutingStateService {
  private history: string[] = [];

  constructor(
    private router: Router,
  ) {
  }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.history = Array.prototype.concat(...this.history, event.urlAfterRedirects);
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/movies';
  }

  public getMoviesLastUrl(): string {
    return findLast(this.history, url => url.includes('movies/')) || '/movies';
  }

  public getSeriesLastUrl(): string {
    return findLast(this.history, url => url.includes('series/')) || '/series';
  }

  public getArtLastUrl(): string {
    return findLast(this.history, url => url.includes('art/')) || '/art';
  }
}
