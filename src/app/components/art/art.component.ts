import {
  Component, OnInit, ViewEncapsulation, OnDestroy, HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Storage } from 'src/app/factories/storage';
import { BackgroundService } from 'src/app/services/background.service';
import { WikiartService } from '../../services/wikiart.service';
import { Painting } from '../../factories/painting';

@Component({
  selector: 'art-component',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ArtComponent implements OnInit, OnDestroy {
  items

  loading: boolean = true;

  popupPainting: Painting;

  intervalId;

  subRouter

  list

  isSearching

  constructor(
    private wikiart: WikiartService,
    private router: Router,
    private title: Title,
    private activeRoute: ActivatedRoute,
    private background: BackgroundService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Art');
    this.background.removeBackground();
    this.subRouter = this.activeRoute.params.subscribe((routeParams) => {
      const { list } = routeParams;
      this.loadList(list);
    });
  }

  ngOnDestroy() {
    this.cancelArrayDelay();
    this.subRouter.unsubscribe();
  }

  checkActivity(status) {
    this.isSearching = status;
  }

  loadList(list: string) {
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

  loadCollection() {
    const paintingsSeen = Storage.readDB('art');
    this.items = Object.keys(paintingsSeen).map(key => paintingsSeen[key]);
    this.loading = false;
  }

  loadDiscover(list) {
    const promise = list === 'paintings' ? this.wikiart.getMostViewedPaintings()
      : this.wikiart.getPopularArtists();
    promise.then((paintings) => {
      this.arrayDelay(paintings);
    }).finally(() => { this.loading = false; });
  }

  onClickArtist(artistUrl) {
    this.router.navigate([`/artist/${artistUrl}`]);
  }

  onClickPortrait(portrait, event) {
    if (event.ctrlKey || event.metaKey) {
      portrait.seen = !portrait.seen;
      portrait.seen ? Storage.addKeyDB('art', portrait) : Storage.deleteKeyDB('art', portrait);
    } else {
      this.popupPainting = portrait;
    }
  }

  private arrayDelay(array) {
    this.items = [];
    let i = 0;
    this.intervalId = setInterval(() => {
      if (i === array.length) {
        this.cancelArrayDelay();
      } else {
        this.items.push(array[i++]);
      }
    }, 50);
  }

  cancelArrayDelay() {
    clearInterval(this.intervalId);
  }
}
