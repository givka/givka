import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { findLast } from 'lodash';
@Injectable({
  providedIn: 'root'
  })
export class RoutingStateService {
  private history = [];

  constructor(
    private router: Router,
  ) { }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.history = [...this.history, event.urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/movies';
  }

  public getMoviesLastUrl() {
    return findLast(this.history, url => url.includes('movies/')) || '/movies';
  }
}
