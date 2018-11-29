import {
  Component, OnInit, ViewEncapsulation, OnDestroy, HostListener,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BackgroundService } from 'src/app/services/background.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Movie } from '../../factories/movie';
import { Storage } from '../../factories/storage';

import { TmdbService } from '../../services/tmdb.service';
import { Utils } from '../../factories/utils';

@Component({
  selector: 'movies-component',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MoviesComponent implements OnInit, OnDestroy {
  movies: Movie[];

  loading = true;

  subRouter: Subscription;

  list: string;

  orderAsc = {
    title: true, releaseDate: true, voteAverage: false, voteCount: false,
  };

  isSearching = false;

  loadingAdd = false;

  offsetPages = 5;

  nbrPages = 5;

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private title: Title,
    private background: BackgroundService,
    public utility : UtilityService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Movies');
    this.background.removeBackground();
    this.subRouter = this.routeActive.params.subscribe((params) => {
      this.loadList(params.list);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pos = document.documentElement.scrollTop;

    if (this.list !== 'collection' && !this.loadingAdd && pos === max) {
      this.addMovies();
    }
  }

  addMovies() {
    this.loadingAdd = true;

    this.tmdb.getDiscoverMovies(this.list, this.offsetPages, this.nbrPages)
      .then((result) => {
        this.offsetPages += this.nbrPages;
        this.movies = this.movies.concat(result);
      })
      .finally(() => { this.loadingAdd = false; });
  }

  checkActivity(status) {
    this.isSearching = status;
  }

  loadList(list: string) {
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
        .map(movie => new Movie().fromStorage(seen[movie], seen));
      this.loading = false;
    } else {
      this.tmdb.getDiscoverMovies(list)
        .then((movies) => { this.movies = movies; })
        .finally(() => { this.loading = false; });
    }
  }

  orderBy(key) {
    const order = this.orderAsc[key] ? 'asc' : 'desc';
    this.orderAsc[key] = !this.orderAsc[key];
    this.loading = true;
    this.movies = Utils.orderBy(this.movies, key, order);
    this.loading = false;
  }
}
