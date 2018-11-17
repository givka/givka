import {
  Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Credit } from 'src/app/factories/credit';
import { Movie } from 'src/app/factories/movie';
import { Serie } from 'src/app/factories/serie';
import { Router } from '@angular/router';
import { Storage } from 'src/app/factories/storage';
import { CreditDetails } from 'src/app/factories/credit-details';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class SearchComponent implements OnInit {
  @Output() onActivity: EventEmitter<boolean> = new EventEmitter();

  @Input() type: string;

  @Input() placeholder: string;

  search = '';

  loading = false;

  debounceQuery = new Subject<string>();

  credits: Credit[]

  movies: Movie[]

  series: Serie[]

  constructor(
    private tmdb: TmdbService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.debounceQuery.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchItems(query);
      });
  }

  onChange() {
    this.loading = true;
    this.onActivity.emit(this.search !== '');
    this.debounceQuery.next(this.search);
  }

  searchItems(query) {
    if (query === '') {
      this.loading = false;
      this.credits = [];
      this.movies = [];
      this.series = [];
      return;
    }

    if (this.type === 'movies') {
      this.searchTmdb(query, 'tv');
    } else if (this.type === 'series') {
      this.searchTmdb(query, 'movie');
    }
  }

  searchTmdb(query, toExclude: string) {
    this.tmdb.getSearch(query, toExclude)
      .then((result) => {
        this.credits = result.credits;
        this.movies = result.movies;
        this.series = result.series;
        console.log(result);
      })
      .finally(() => { this.loading = false; });
  }

  onClickItem(item, event) {
    if (item instanceof Movie) {
      this.onClickMovie(item, event);
    } else if (item instanceof Serie) {
      this.onClickSerie(item, event);
    } else if (item instanceof Credit) {
      this.onClickCredit(item);
    }
  }

  onClickCredit(credit) {
    this.router.navigate([`/credit/${credit.id}`]);
  }

  onClickMovie(movie: Movie, event) {
    if (event.ctrlKey || event.metaKey) {
      movie.toggleSeen();
      movie.seen ? Storage.addKeyDB('movies', movie) : Storage.deleteKeyDB('movies', movie);
    } else {
      this.router.navigate([`movie/${movie.id}`]);
    }
  }

  onClickSerie(serie: Serie, event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      serie.toggleSeen();
      serie.seen ? Storage.addKeyDB('series', serie) : Storage.deleteKeyDB('series', serie);
    } else {
      this.router.navigate([`serie/${serie.id}`]);
    }
  }
}
