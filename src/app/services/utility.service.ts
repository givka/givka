import { Injectable } from '@angular/core';
import { Router, Event } from '@angular/router';
import { BackgroundService } from './background.service';
import { Movie } from '../factories/movie';
import { Storage } from '../factories/storage';
import { Serie } from '../factories/serie';
import { MovieDetails } from '../factories/movie-details';
import { SerieDetails } from '../factories/serie-details';
import { Credit } from '../factories/credit';

@Injectable({
  providedIn: 'root'
  })
export class UtilityService {
  constructor(
   private background :BackgroundService,
   private router : Router,
  ) { }

  public onClickMovie(movie: Movie, event: KeyboardEvent):void {
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
    dbKey: string, url: string, call: Function) {
    if (event.ctrlKey || event.metaKey) {
      call();
      item.seen ? Storage.addKeyDB(dbKey, item) : Storage.deleteKeyDB(dbKey, item);
    } else {
      this.background.addBackground(`https://image.tmdb.org/t/p/w300${item.backdrop}`);
      this.router.navigate([`${url}/${item.id}`]);
    }
  }
}
