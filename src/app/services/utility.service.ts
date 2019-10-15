import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Credit} from '../classes/credit';
import {Movie} from '../classes/movie';
import {MovieDetails} from '../classes/movie-details';
import {Serie} from '../classes/serie';
import {SerieDetails} from '../classes/serie-details';
import {Storage} from '../classes/storage';
import {CreditDetails} from '../classes/credit-details';

@Injectable({
  providedIn: 'root',
})

export class UtilityService {
  constructor(
    private router: Router,
  ) {
  }

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

  onClickItemDetails(item: Movie | Serie, itemDetails: MovieDetails | SerieDetails | CreditDetails, $event: KeyboardEvent) {
    if (itemDetails instanceof MovieDetails) {
      this.onClickMovieDetails(item, itemDetails, $event);
    }
    if (itemDetails instanceof SerieDetails) {
      this.onClickSerieDetails(item, itemDetails, $event);
    }
    if (itemDetails instanceof CreditDetails) {
      if (item instanceof Movie) {
        this.onClickMovie(item, $event);
      }
      if (item instanceof Serie) {
        this.onClickSerie(item, $event);
      }
    }
  }
}
