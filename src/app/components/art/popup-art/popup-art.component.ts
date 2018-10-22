import {
  Component, OnInit, ViewEncapsulation, Input, HostListener, Output, EventEmitter,
} from '@angular/core';
import { findIndex } from 'lodash';
import { Painting } from '../../../factories/painting';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'popup-art-component',
  templateUrl: './popup-art.component.html',
  styleUrls: ['./popup-art.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class PopupArtComponent implements OnInit {
  @Input() paintings: Painting[]

  @Input() painting: Painting

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  loading = true;

  index;

  constructor(private broadcast: BroadcastService) { }

  ngOnInit() {
    this.index = findIndex(this.paintings, this.painting);
  }

  onImageLoad() {
    this.loading = false;
  }

  changePainting(indexInc: number) {
    this.loading = true;
    this.index += indexInc;
    if (this.index < 0) {
      this.index = this.paintings.length - 1;
    } else if (this.index === this.paintings.length) {
      this.index = 0;
    }
    this.painting = this.paintings[this.index];
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    event.stopPropagation();

    switch (event.key) {
      case 'ArrowRight':
        this.changePainting(1);
        break;
      case 'ArrowLeft':
        this.changePainting(-1);
        break;
      case 'ArrowDown':
        this.onClickArtist(this.painting.artistUrl);
        break;

      default:
        break;
    }
  }

  onClickArtist(artistUrl) {
    this.broadcast.sendArtistUrl(artistUrl);
  }
}
