import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation,} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Movie} from '../../classes/movie';
import {Storage} from '../../classes/storage';
import {UtilityService} from '../../services/utility.service';

import {Sort} from '@angular/material';
import {Utils} from '../../classes/utils';
import {TmdbService} from '../../services/tmdb.service';

@Component({
  selector: 'movies-component',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class MoviesComponent implements OnInit, OnDestroy {
  public movies!: Movie[];
  public sortedMovies!: Movie[];
  public loading = true;
  public subRouter!: Subscription;
  public list!: string;
  public isSearching = false;
  public loadingAdd = false;
  public offsetPages = 5;
  public nbrPages = 5;
  public sortActive = '';
  public linkButtons = [
    {title: 'Popular', url: '/movies/popular'},
    {title: 'Top Rated', url: '/movies/top_rated'},
    {title: 'Collection', url: '/movies/collection'},
  ];

  public sortButtons = [
    {title: 'Title', key: 'title'},
    {title: 'Release Date', key: 'releaseDate'},
    {title: 'Vote Count', key: 'voteCount'},
    {title: 'Vote Average', key: 'voteAverage'},
  ];

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private title: Title,
    public utility: UtilityService,
  ) {
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    const max = document.documentElement!.scrollHeight - document.documentElement!.clientHeight;
    const pos = document.documentElement!.scrollTop;

    if (this.list !== 'collection' && !this.loadingAdd && pos === max) {
      this.addMovies();
    }
  }

  public ngOnInit() {
    this.title.setTitle('Movies - Givka');
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
        this.sortedMovies = this.movies.slice();
      })
      .finally(() => {
        this.loadingAdd = false;
      });
  }

  public checkActivity(status: boolean) {
    this.isSearching = status;
  }

  public loadList(list: string) {
    const possibleLists = ['top_rated', 'popular', 'collection'];
    if (!possibleLists.includes(list)) {
      this.router.navigate(['movies']);
      return;
    }

    this.list = list;
    this.loading = true;
    if (list === 'collection') {
      const seen = Storage.readDB('movies');
      this.movies = Object.keys(seen).map(movie => new Movie().fromStorage(seen[movie]));
      this.sortedMovies = this.movies.slice();
      this.loading = false;
    } else {
      this.tmdb.getDiscoverMovies(list)
        .then((movies) => {
          this.movies = movies;
          this.sortedMovies = this.movies.slice();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  public sort(sort: Sort) {
    if (sort.direction === '') {
      this.sortedMovies = this.movies.slice();
      this.sortActive = '';
      return;
    }
    this.sortActive = sort.active;
    this.loading = true;
    this.sortedMovies = Utils.orderBy(this.movies, sort.active, sort.direction);
    this.loading = false;
  }
}
