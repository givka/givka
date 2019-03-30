import {
  Component, HostListener, OnDestroy, OnInit, ViewEncapsulation,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Artist } from '../../classes/artist';
import { Painting } from '../../classes/painting';
import { Storage } from '../../classes/storage';
import { WikiartService } from '../../services/wikiart.service';

@Component({
  selector: 'art-component',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArtComponent implements OnInit, OnDestroy {
  public items!: any[];
  public loading: boolean = true;
  public popupPainting!: Painting;
  public intervalId!: number;
  public subRouter!: Subscription;
  public list!: string;
  public isSearching = false;
  public currentPage = 0;
  public linkButtons = [
  { title: 'Popular Artists', url:'/art/artists' },
  { title: 'Popular Paintings', url:'/art/paintings' },
  { title: 'Collection', url:'/art/collection' },
  ];

  constructor(
    private wikiart: WikiartService,
    private router: Router,
    private title: Title,
    private activeRoute: ActivatedRoute,
  ) { }

  public ngOnInit() {
    this.title.setTitle('Art - Givka');
    this.subRouter = this.activeRoute.params.subscribe((routeParams) => {
      const { list } = routeParams;
      this.loadList(list);
    });
  }

  public ngOnDestroy() {
    this.cancelArrayDelay();
    this.subRouter.unsubscribe();
  }

  public checkActivity(status: boolean) {
    this.isSearching = status;
  }

  public loadList(list: string) {
    const possibleLists = ['collection', 'artists', 'paintings'];
    if (!possibleLists.includes(list)) {
      this.router.navigate(['/art']);
      return;
    }
    this.list = list;
    this.loading = true;
    this.cancelArrayDelay();
    if (list === 'collection') {
      this.loadCollection();
    } else {
      this.loadDiscover(list);
    }
  }

  public loadCollection() {
    const paintingsSeen = Storage.readDB('art');
    this.items = Object.keys(paintingsSeen)
    .map(key => new Painting(paintingsSeen[key]).fromStorage(paintingsSeen[key]));
    this.loading = false;
  }

  public loadDiscover(list: string) {
    const promise = list === 'paintings' ? this.loadDiscoverPaintings()
                                         : this.wikiart.getPopularArtists();

    promise.then((items) => {
      this.arrayDelay(items);
    }).finally(() => { this.loading = false; });
  }

  public loadDiscoverPaintings() {
    if (this.currentPage === 0) {
      this.currentPage += 2;
      return Promise
        .all([this.wikiart.getMostViewedPaintings(1), this.wikiart.getMostViewedPaintings(2)])
        .then(([paintings1, paintings2]) => Array.prototype.concat(paintings1, paintings2));
    }
    this.currentPage += 1;
    return this.wikiart.getMostViewedPaintings(this.currentPage);
  }

  public onClickArtist(artistUrl: string) {
    this.router.navigate([`/artist/${artistUrl}`]);
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
    window.clearInterval(this.intervalId);
  }

  private arrayDelay(items: any[]) {
    this.items = [];
    let i = 0;
    this.intervalId = window.setInterval(() => {
      if (i === items.length) {
        this.cancelArrayDelay();
      } else {
        this.items.push(items[i]);
        i = i + 1;
      }
    },                                   50);
  }
}
