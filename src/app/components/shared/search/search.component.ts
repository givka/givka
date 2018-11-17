import {
  Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, OnDestroy,
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
import { Painting } from 'src/app/factories/painting';
import { UtilityService } from 'src/app/services/utility.service';
import { WikiartService } from 'src/app/services/wikiart.service';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class SearchComponent implements OnInit, OnDestroy {
  @Output() onActivity: EventEmitter<boolean> = new EventEmitter();

  @Input() type: string;

  @Input() placeholder: string;

  search = '';

  loading = false;

  debounceQuery = new Subject<string>();

  credits: Credit[]= []

  movies: Movie[]= []

  series: Serie[]= []

  paintings: Painting[]=[]

  popupPainting : Painting;

  intervalId;

  constructor(
    private tmdb: TmdbService,
    private wikiart: WikiartService,
    private utility: UtilityService,
  ) { }

  ngOnInit() {
    this.debounceQuery.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchItems(query);
      });
  }

  ngOnDestroy(): void {
    this.cancelArrayDelay();
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
      this.paintings = [];
      return;
    }

    if (this.type === 'movies') {
      this.searchTmdb(query, 'tv');
    } else if (this.type === 'series') {
      this.searchTmdb(query, 'movie');
    } else if (this.type === 'paintings') {
      this.searchWikiArt(query);
    }
  }

  searchWikiArt(query: string) {
    this.cancelArrayDelay();
    this.wikiart.getSearch(query.trim())
      .then((result) => { this.arrayDelay(result); })
      .finally(() => { this.loading = false; });
  }

  searchTmdb(query, toExclude: string) {
    this.tmdb.getSearch(query, toExclude)
      .then((result) => {
        this.credits = result.credits;
        this.movies = result.movies;
        this.series = result.series;
      })
      .finally(() => { this.loading = false; });
  }

  onClickItem(item, event) {
    if (item instanceof Movie) {
      this.utility.onClickMovie(item, event);
    } else if (item instanceof Serie) {
      this.utility.onClickSerie(item, event);
    } else if (item instanceof Credit) {
      this.utility.onClickCredit(item);
    } else if (item instanceof Painting) {
      this.onClickPortrait(item, event);
    }
  }

  onClickPortrait(portrait, event) {
    if (event.ctrlKey || event.metaKey) {
      portrait.seen = !portrait.seen;
      portrait.seen ? Storage.addKeyDB('art', portrait) : Storage.deleteKeyDB('art', portrait);
    } else {
      this.popupPainting = portrait;
    }
  }

  private arrayDelay(paintings: Painting[]) {
    this.paintings = [];
    let i = 0;
    console.log(paintings);
    this.intervalId = setInterval(() => {
      if (i === paintings.length) {
        this.cancelArrayDelay();
      } else {
        this.paintings.push(paintings[i++]);
      }
    }, 50);
  }

  cancelArrayDelay() {
    clearInterval(this.intervalId);
  }
}
