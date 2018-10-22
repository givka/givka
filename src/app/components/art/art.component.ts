import {
  Component, OnInit, ViewEncapsulation, OnDestroy, HostListener,
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
        this.paintings = artist.paintings;
        this.artistDetails = artist;
      })
      .finally(() => { this.loading = false; });
  }

  onClickPortrait(portrait, $event) {
    if (portrait instanceof Painting) {
      this.showPopup = true;
      this.popupLoading = true;

      this.popupPainting = portrait;
      this.popupIndex = findIndex(this.paintings, portrait);
    } else {
      this.onClickArtist(portrait.artistUrl);
    }
  }

  popupChangePainting(indexInc: number) {
    this.popupLoading = true;
    this.popupIndex += indexInc;
    if (this.popupIndex < 0) {
      this.popupIndex = this.paintings.length - 1;
    } else if (this.popupIndex === this.paintings.length) {
      this.popupIndex = 0;
    }
    this.popupPainting = this.paintings[this.popupIndex];
  }

  onImageLoad() {
    this.popupLoading = false;
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    event.stopPropagation();
    console.log(event.key);
    if (!this.showPopup) { return; }
    switch (event.key) {
      case 'ArrowRight':
        this.popupChangePainting(1);
        break;
      case 'ArrowLeft':
        this.popupChangePainting(-1);
        break;

      default:
        break;
    }
  }
}
