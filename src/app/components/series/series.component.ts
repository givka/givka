import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Serie } from 'src/app/factories/serie';
import { Utils } from 'src/app/factories/utils';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Movie } from 'src/app/factories/movie';

import { BackgroundService } from 'src/app/services/background.service';
import { Storage } from '../../factories/storage';

@Component({
  selector: 'series-component',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class TvComponent implements OnInit {
  series: Serie[]

  loading

  list

  subRouter: Subscription

  orderAsc = {
    title: true, releaseDate: true, voteAverage: false, voteCount: false,
  }

  isSearching = false;

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private title: Title,
    private background: BackgroundService,
  ) { }

  ngOnInit() {
    this.title.setTitle('TV Series');
    this.background.removeBackground();
    this.subRouter = this.routeActive.params.subscribe((params) => {
      this.loadList(params.list);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  checkActivity(status) {
    this.isSearching = status;
  }

  loadList(list: string) {
    const possibleLists = ['top_rated', 'popular', 'collection', 'on_the_air'];
    if (!possibleLists.includes(list)) {
      this.router.navigate(['series']);
      return;
    }
    this.list = list;
    this.loading = true;
    if (list === 'collection') {
      const seen = Storage.readDB('series');
      this.series = Object.keys(seen)
        .map(movie => new Serie(seen[movie], seen));
      this.loading = false;
    } else {
      this.tmdb.getDiscoverSeries(list)
        .then((series) => { this.series = series; })
        .finally(() => { this.loading = false; });
    }
  }

  orderBy(key) {
    const order = this.orderAsc[key] ? 'asc' : 'desc';
    this.orderAsc[key] = !this.orderAsc[key];
    this.loading = true;
    this.series = Utils.orderBy(this.series, key, order);
    this.loading = false;
  }

  onClickSerie(serie, event) {
    if (event.ctrlKey || event.metaKey) {
      serie.toggleSeen(serie);
      serie.seen ? Storage.addKeyDB('series', serie) : Storage.deleteKeyDB('series', serie);
    } else {
      this.background.addBackground(`https://image.tmdb.org/t/p/w300${serie.backdrop}`);
      this.router.navigate([`serie/${serie.id}`]);
    }
  }
}
