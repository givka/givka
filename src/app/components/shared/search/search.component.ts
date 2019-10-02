import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation,} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Credit} from '../../../classes/credit';
import {Movie} from '../../../classes/movie';
import {Painting} from '../../../classes/painting';
import {Serie} from '../../../classes/serie';
import {Storage} from '../../../classes/storage';
import {TmdbService} from '../../../services/tmdb.service';
import {UtilityService} from '../../../services/utility.service';
import {WikiartService} from '../../../services/wikiart.service';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() public onActivity: EventEmitter<boolean> = new EventEmitter();

  @Input() public type!: string;

  @Input() public placeholder!: string;

  public search = '';

  public loading = false;

  public debounceQuery = new Subject<string>();

  public credits: Credit[] = [];

  public movies: Movie[] = [];

  public series: Serie[] = [];

  public paintings: Painting[] = [];

  public popupPainting!: Painting;

  public intervalId!: number;

  constructor(
    private tmdb: TmdbService,
    private wikiart: WikiartService,
    private utility: UtilityService,
  ) {
  }

  public ngOnInit() {
    this.debounceQuery.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchItems(query);
      });
  }

  public ngOnDestroy(): void {
    this.cancelArrayDelay();
  }

  public onChange() {
    this.loading = true;
    this.onActivity.emit(this.search !== '');
    this.debounceQuery.next(this.search);
  }

  public searchItems(query: string) {
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

  public searchWikiArt(query: string) {
    this.cancelArrayDelay();
    this.wikiart.getSearch(query.trim())
      .then((result) => {
        this.arrayDelay(result);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public searchTmdb(query: string, toExclude: string) {
    this.tmdb.getSearch(query, toExclude)
      .then((result: any) => {
        this.credits = result.credits;
        this.movies = result.movies;
        this.series = result.series;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public onClickItem(item: Movie | Serie | Credit | Painting, event: KeyboardEvent) {
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

  public onClickPortrait(portrait: Painting, event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      portrait.seen = !portrait.seen;
      portrait.seen ? Storage.addKeyDB('art', portrait) : Storage.deleteKeyDB('art', portrait);
    } else {
      this.popupPainting = portrait;
    }
  }

  public cancelArrayDelay() {
    clearInterval(this.intervalId);
  }

  private arrayDelay(paintings: Painting[]) {
    this.paintings = [];
    let i = 0;
    this.intervalId = window.setInterval(() => {
      if (i === paintings.length) {
        this.cancelArrayDelay();
      } else {
        this.paintings.push(paintings[i]);
        i = i + 1;
      }
    }, 50);
  }
}
