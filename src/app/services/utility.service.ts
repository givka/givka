import { Injectable } from '@angular/core';
import { Event, Router } from '@angular/router';
import { Credit } from '../classes/credit';
import { Movie } from '../classes/movie';
import { MovieDetails } from '../classes/movie-details';
import { Serie } from '../classes/serie';
import { SerieDetails } from '../classes/serie-details';
import { Storage } from '../classes/storage';

@Injectable({
  providedIn: 'root',
})

export class UtilityService {
  constructor(
   private router: Router,
  ) { }

  public onClickMovie(movie: Movie, event: KeyboardEvent): void {
    this.onClickTmdb(movie, event, 'movies', 'movie', () => movie.toggleSeen());
  }

  public onClickSerie(serie: Serie, event: KeyboardEvent) {
    this.onClickTmdb(serie, event, 'series', 'serie', () => serie.toggleSeen());
  }

  public onClickSerieDetails(serie: Serie, serieDetails: SerieDetails, event: KeyboardEvent) {
    this.onClickTmdb(serie, event, 'series', 'serie', () => serieDetails.toggleListSeen(serie));
  }

  public onClickMovieDetails(movie: Movie, movieDetails: MovieDetails, event: KeyboardEvent) {
    this.onClickTmdb(movie, event, 'movies', 'movie', () => movieDetails.toggleListSeen(movie));
  }

  public onClickCredit(credit: Credit) {
    this.router.navigate([`/credit/${credit.id}`]);
  }

  private onClickTmdb(item: Movie | Serie, event: KeyboardEvent,
                      dbKey: string, url: string, call: () => void) {
    if (event.ctrlKey || event.metaKey) {
      call();
      item.seen ? Storage.addKeyDB(dbKey, item) : Storage.deleteKeyDB(dbKey, item);
    } else {
      this.router.navigate([`${url}/${item.id}`]);
    }
  }
}
