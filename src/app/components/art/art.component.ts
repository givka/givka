import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';
import { random, findIndex } from 'lodash';
import { WikiartService } from '../../services/wikiart.service';
import { Painting } from '../../factories/painting';
import { Artist } from '../../factories/artist';
import { BroadcastService } from '../../services/broadcast.service';
import { ArtistDetails } from '../../factories/artistDetails';

@Component({
  selector: 'art-component',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ArtComponent implements OnInit, OnDestroy {
  paintings: any

  showPopup: boolean = false;

  loading: boolean = true;

  popupPainting: Painting;

  popupIndex: number;

  popupLoading: boolean = true;

  artistDetails: ArtistDetails

  artists: Artist[]

  tabSelected: string;

  subscription: any;

  constructor(
    private wikiart: WikiartService,
    private broadcast: BroadcastService,
  ) { }

  ngOnInit() {
    this.subscription = this.broadcast.getPortrait()
      .subscribe((subject) => {
        this.onClickPortrait(subject.portrait, subject.event);
      });

    this.onClickDiscover();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickDiscover() {
    this.loading = true;
    this.tabSelected = 'discover';
    this.wikiart.getMostViewedPaintings()
      .then((data) => {
        this.paintings = data;
      })
      .finally(() => { this.loading = false; });
  }

  onClickArtists() {
    this.loading = true;
    this.tabSelected = 'artists';
    this.wikiart.getPopularArtists()
      .then((artists) => {
        this.artists = artists;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onClickArtist(artistUrl) {
    this.loading = true;
    this.showPopup = false;
    this.tabSelected = 'artist-details';
    this.wikiart.getArtistDetails(artistUrl)
      .then((artist) => {
        console.log(artist);

        this.artistDetails = artist;
      })
      .finally(() => { this.loading = false; });
  }

  onClickPortrait(portrait, $event) {
    const paintings = this.tabSelected === 'artist-details'
      ? this.artistDetails.paintings : this.paintings;

    if (portrait instanceof Painting) {
      this.showPopup = true;
      this.popupLoading = true;

      this.popupPainting = portrait;
      this.popupIndex = findIndex(paintings, portrait);
    } else {
      this.onClickArtist(portrait.artistUrl);
    }
  }

  popupChangePainting(index: number) {
    const paintings = this.tabSelected === 'artist-details'
      ? this.artistDetails.paintings : this.paintings;

    this.popupLoading = true;
    if (index > 0) {
      if (this.popupIndex === paintings.length) {
        this.popupIndex = 0;
      } else {
        this.popupIndex++;
      }
    } else if (this.popupIndex === 0) {
      this.popupIndex = paintings.length;
    } else {
      this.popupIndex--;
    }

    this.popupPainting = paintings[this.popupIndex];
    console.log(this.popupPainting);
  }

  onImageLoad() {
    this.popupLoading = false;
  }
}
