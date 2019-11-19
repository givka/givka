import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation,} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Painting} from '../../classes/painting';
import {Storage} from '../../classes/storage';
import {WikiartService} from '../../services/wikiart.service';
import {Artist} from '../../classes/artist';

@Component({
  selector: 'art-component',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArtComponent implements OnInit, OnDestroy {
  public items: any[] = [];
  public loading: boolean = true;
  public popupPainting!: Painting;
  public intervalId!: number;
  public subRouter!: Subscription;
  public list!: string;
  public isSearching = false;
  public linkButtons = [
    {title: 'Popular Artists', url: 'artists'},
    {title: 'Recently Added Paintings', url: 'recently-added-artworks'},
    {title: 'High resolutions Paintings', url: 'high_resolution'},
    {title: 'Featured Paintings', url: 'featured'},
    {title: 'Collection', url: 'collection'},
  ];
  public page = 0;
  public loadingAdd = false;

  constructor(
    private wikiart: WikiartService,
    private router: Router,
    private title: Title,
    private activeRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.title.setTitle('Art - Givka');
    this.subRouter = this.activeRoute.params.subscribe((routeParams) => {
      const {list} = routeParams;
      this.loadList(list);
    });
  }

  public ngOnDestroy() {
    this.cancelArrayDelay();
    this.subRouter.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    const max = document.documentElement!.scrollHeight - document.documentElement!.clientHeight;
    const pos = document.documentElement!.scrollTop;

    if (this.list !== 'collection' && !this.loadingAdd && pos === max) {
      this.loadDiscover(this.list, true);
    }
  }

  public checkActivity(status: boolean) {
    this.isSearching = status;
  }

  public loadList(list: string) {
    this.page = 0;
    const possibleLists = this.linkButtons.map(l => l.url);
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
      this.loadDiscover(list, false);
    }
  }

  public loadCollection() {
    const paintingsSeen = Storage.readDB('art');
    this.items = Object.keys(paintingsSeen)
      .map(key => new Painting(paintingsSeen[key]).fromStorage(paintingsSeen[key]));
    this.loading = false;
  }

  public loadDiscover(list: string, isAdding: boolean) {
    this.page++;
    if (list == 'artists') {
      this.wikiart.getPopularArtists(this.page)
        .then((items: Painting[] | Artist[]) => {
          this.arrayDelay(items, isAdding);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.wikiart.getMostViewedPaintings(list, this.page)
        .then((items: Painting[] | Artist[]) => {
          this.arrayDelay(items, isAdding);
        })
        .finally(() => {
          this.loading = false;
        });
    }

  }

  public onClickArtist(artistUrl: string) {
    this.router.navigate([`/artist/${artistUrl.replace('en/', '')}`]);
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
    this.loadingAdd = false;
    window.clearInterval(this.intervalId);
  }

  private arrayDelay(items: any[], isAdding: boolean) {
    if (!isAdding) {
      this.items = [];
    } else {
      this.loadingAdd = true;
    }
    let i = 0;
    this.intervalId = window.setInterval(() => {
      if (i === items.length) {
        this.cancelArrayDelay();
      } else {
        this.items.push(items[i]);
        i = i + 1;
      }
    }, 50);
  }
}
