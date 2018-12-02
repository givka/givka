import {
  Component, HostListener, OnDestroy, OnInit, ViewEncapsulation,
} from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from '../../classes/movie';
import { Storage } from '../../classes/storage';
import { BackgroundService } from '../../services/background.service';
import { UtilityService } from '../../services/utility.service';
import { IOrder } from '../../interfaces/all';

import { Utils } from '../../classes/utils';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'movies-component',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MoviesComponent implements OnInit, OnDestroy {
  public movies!: Movie[];

  public loading = true;

  public subRouter!: Subscription;

  public list!: string;

  public orderAsc: IOrder = {
    title: true, releaseDate: true, voteAverage: false, voteCount: false,
  };

  public isSearching = false;

  public loadingAdd = false;

  public offsetPages = 5;

  public nbrPages = 5;

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private title: Title,
    private background: BackgroundService,
    public utility : UtilityService,
  ) { }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    const max = document.documentElement!.scrollHeight - document.documentElement!.clientHeight;
    const pos = document.documentElement!.scrollTop;

    if (this.list !== 'collection' && !this.loadingAdd && pos === max) {
      this.addMovies();
    }
  }

  public ngOnInit() {
    this.title.setTitle('Movies');
    this.background.removeBackground();
    this.subRouter = this.routeActive.params.subscribe((params) => {
      this.loadList(params.list);
    });
  }

  public ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  public addMovies() {
    this.loadingAdd = true;

    this.tmdb.getDiscoverMovies(this.list, this.offsetPages, this.nbrPages)
      .then((result) => {
        this.offsetPages += this.nbrPages;
        this.movies = this.movies.concat(result);
      })
      .finally(() => { this.loadingAdd = false; });
  }

  public checkActivity(status: boolean) {
    this.isSearching = status;
  }

  public loadList(list: string) {
    const possibleLists = ['upcoming', 'top_rated', 'popular', 'collection'];
    if (!possibleLists.includes(list)) {
      this.router.navigate(['movies']);
      return;
    }

    this.list = list;
    this.loading = true;
    if (list === 'collection') {
      const seen = Storage.readDB('movies');
      this.movies = Object.keys(seen)
        .map(movie => new Movie().fromStorage(seen[movie]));
      this.loading = false;
    } else {
      this.tmdb.getDiscoverMovies(list)
        .then((movies) => { this.movies = movies; })
        .finally(() => { this.loading = false; });
    }
  }

  public orderBy(key: string) {
    const order = this.orderAsc[key] ? 'asc' : 'desc';
    this.orderAsc[key] = !this.orderAsc[key];
    this.loading = true;
    this.movies = Utils.orderBy(this.movies, key, order);
    this.loading = false;
  }
}
