import {
  Component, HostListener, OnInit, ViewEncapsulation,
} from '@angular/core';
import { Sort } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Serie } from '../../classes/serie';
import { Storage } from '../../classes/storage';
import { Utils } from '../../classes/utils';
import { IOrder } from '../../interfaces/all';
import { TmdbService } from '../../services/tmdb.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'series-component',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TvComponent implements OnInit {
  public series!: Serie[];
  public sortedSeries!: Serie[];
  public loading = true;
  public list!: string;
  public subRouter!: Subscription;
  public orderAsc: IOrder = {
    title: true, releaseDate: true, voteAverage: false, voteCount: false,
  };
  public isSearching = false;
  public loadingAdd = false;
  public offsetPages = 5;
  public nbrPages = 5;
  public linkButtons = [
  { title: 'On the Air', url:'/series/on_the_air' },
  { title: 'Popular', url:'/series/popular' },
  { title: 'Top Rated', url:'/series/top_rated' },
  { title: 'Collection', url:'/series/collection' },
  ];
  public sortButtons = [
  { title: 'Title', key:'title' },
  { title: 'Release Date', key:'releaseDate' },
  { title: 'Vote Count', key:'voteCount' },
  { title: 'Vote Average', key:'voteAverage' },
  ];
  public sortActive = '';

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private title: Title,
    public utility: UtilityService,
  ) { }

  public ngOnInit() {
    this.title.setTitle('TV Series - Givka');
    this.subRouter = this.routeActive.params.subscribe((params) => {
      this.loadList(params.list);
    });
  }

  public ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  public checkActivity(status: boolean) {
    this.isSearching = status;
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    const max = document.documentElement!.scrollHeight - document.documentElement!.clientHeight;
    const pos = document.documentElement!.scrollTop;

    if (this.list !== 'collection' && !this.loadingAdd && pos === max) {
      this.addSeries();
    }
  }

  public addSeries() {
    this.loadingAdd = true;

    this.tmdb.getDiscoverSeries(this.list, this.offsetPages, this.nbrPages)
      .then((result) => {
        this.offsetPages += this.nbrPages;
        this.series = this.series.concat(result);
        this.sortedSeries = this.series.slice();
      })
      .finally(() => {
        setTimeout(() => { this.loadingAdd = false; }, 500);
      });
  }

  public loadList(list: string) {
    const possibleLists = ['top_rated', 'popular', 'collection', 'on_the_air'];
    if (!possibleLists.includes(list)) {
      this.router.navigate(['series']);
      return;
    }
    this.list = list;
    this.loading = true;
    if (list === 'collection') {
      const seen = Storage.readDB('series');
      this.series = Object.keys(seen).map(serieId => new Serie().fromStorage(seen[serieId]));
      this.sortedSeries = this.series.slice();
      this.loading = false;
    } else {
      this.tmdb.getDiscoverSeries(list)
        .then((series) => {
          this.series = series;
          this.sortedSeries = this.series.slice();
        })
        .finally(() => { this.loading = false; });
    }
  }

  public sort(sort: Sort) {
    if (sort.direction === '') {
      this.sortedSeries = this.series.slice();
      this.sortActive = '';
      return;
    }
    this.sortActive = sort.active;
    this.loading = true;
    this.sortedSeries = Utils.orderBy(this.series, sort.active, sort.direction);
    this.loading = false;
  }
}
