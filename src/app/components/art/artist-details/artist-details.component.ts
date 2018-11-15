import {
  Component, OnInit, ViewEncapsulation, Input,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WikiartService } from 'src/app/services/wikiart.service';
import { ArtistDetails } from 'src/app/factories/artist-details';
import { Painting } from 'src/app/factories/painting';
import { Title } from '@angular/platform-browser';
import { Storage } from 'src/app/factories/storage';
import { RoutingStateService } from 'src/app/services/routing-state.service';

@Component({
  selector: 'artist-details-component',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ArtistDetailsComponent implements OnInit {
  artist: ArtistDetails

  subRouter: Subscription

  loading = true;

  intervalId;

  paintings: Painting[]

  popupPainting: Painting

  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private wikiart: WikiartService,
    private title: Title,
    private routingState: RoutingStateService,
  ) {
  }

  ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { artistUrl } = routeParams;
      this.loadArtistDetails(artistUrl);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
    this.cancelArrayDelay();
  }

  loadArtistDetails(artistUrl: string) {
    this.loading = true;
    this.cancelArrayDelay();
    this.wikiart.getArtistDetails(artistUrl)
      .then((artist) => {
        this.title.setTitle(artist.artistName);
        this.arrayDelay(artist.paintings);
        this.artist = artist;
      })
      .finally(() => { this.loading = false; });
  }

  private arrayDelay(array) {
    this.paintings = [];
    let i = 0;
    this.intervalId = setInterval(() => {
      if (i === array.length) {
        this.cancelArrayDelay();
      } else {
        this.paintings.push(array[i++]);
      }
    }, 50);
  }

  onClickPortrait(portrait, event) {
    if (event.ctrlKey || event.metaKey) {
      portrait.seen = !portrait.seen;
      portrait.seen ? Storage.addKeyDB('art', portrait) : Storage.deleteKeyDB('art', portrait);
    } else {
      this.popupPainting = portrait;
    }
  }

  cancelArrayDelay() {
    clearInterval(this.intervalId);
  }

  onCloseArtist() {
    this.router.navigate([this.routingState.getArtLastUrl()]);
  }
}
