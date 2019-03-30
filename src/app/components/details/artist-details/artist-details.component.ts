import {
  Component, HostListener, Input, OnInit, ViewEncapsulation,
} from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { random } from 'lodash';
import { Subscription } from 'rxjs';
import { ArtistDetails } from '../../../classes/artist-details';
import { Painting } from '../../../classes/painting';
import { Storage } from '../../../classes/storage';
import { RoutingStateService } from '../../../services/routing-state.service';
import { WikiartService } from '../../../services/wikiart.service';

@Component({
  selector: 'artist-details-component',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistDetailsComponent implements OnInit {
  public artist!: ArtistDetails;
  public subRouter!: Subscription;
  public loading = true;
  public intervalId!: number;
  public paintings!: Painting[];
  public popupPainting!: Painting;
  public loadingAdd = false;
  public background = `${random(0, 16)}.jpg`;
  public page = 0;

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private wikiart: WikiartService,
    private title: Title,
    private routingState: RoutingStateService,
  ) {
  }

  public ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { artistUrl } = routeParams;
      this.loadArtistDetails(artistUrl);
    });
  }

  public ngOnDestroy() {
    this.subRouter.unsubscribe();
    this.cancelArrayDelay();
  }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    const max = document.documentElement!.scrollHeight - document.documentElement!.clientHeight;
    const pos = document.documentElement!.scrollTop;

    if (!this.loadingAdd && pos === max) {
      this.addPaintings();
    }
  }

  public addPaintings() {
    this.page += 1;
    const database = Storage.readDB('art');
    return this.wikiart.getArtistPaintings(this.artist.artistUrl, this.page)
      .then(painting => painting.map((p:any) => new Painting(p).fromServer(p, database)))
      .then(paintings => this.arrayDelay(paintings, true));
  }

  public loadArtistDetails(artistUrl: string) {
    this.loading = true;
    this.cancelArrayDelay();
    this.wikiart.getArtistDetails(artistUrl)
      .then((artist) => {
        this.page = 2;
        this.title.setTitle(`${artist.artistName} - Givka`);
        this.arrayDelay(artist.paintings, false);
        this.artist = artist;
      })
      .finally(() => { this.loading = false; });
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

  public onCloseArtist() {
    this.router.navigate([this.routingState.getArtLastUrl()]);
  }

  private arrayDelay(paintings: Painting[], isAdding: boolean) {
    if (!isAdding) {
      this.paintings = [];
    } else {
      this.loadingAdd = true;
    }
    let i = 0;
    this.intervalId = window.setInterval(() => {
      if (i === paintings.length) {
        this.cancelArrayDelay();
      } else {
        this.paintings.push(paintings[i]);
        i = i + 1;
      }
    },                                   50);
  }
}
