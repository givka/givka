import {
  Component, OnInit, ViewEncapsulation, Input, HostListener, Output, EventEmitter,
} from '@angular/core';
import { findIndex } from 'lodash';
import { Router } from '@angular/router';
import { Storage } from 'src/app/factories/storage';
import { Painting } from '../../../factories/painting';

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

  message: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.index = findIndex(this.paintings, this.painting);
  }

  onImageLoad() {
    this.loading = false;
  }

  changePainting(indexInc: number) {
    this.loading = true;
    this.message = null;
    this.index += indexInc;
    if (this.index < 0) {
      this.index = this.paintings.length - 1;
    } else if (this.index === this.paintings.length) {
      this.index = 0;
    }
    this.painting = this.paintings[this.index];
  }

  showMessage(message) {
    this.message = message;
    setTimeout(() => { this.message = null; }, 500);
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    event.preventDefault();
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
        this.onClose.emit();
        break;

      case 'ArrowUp':
        this.painting.seen = !this.painting.seen;
        if (this.painting.seen) {
          Storage.addKeyDB('art', this.painting);
          this.showMessage('Saved');
        } else {
          Storage.deleteKeyDB('art', this.painting);
          this.showMessage('Removed');
        }

        break;
      default:
        break;
    }
  }

  onClickArtist(artistUrl) {
    this.router.navigate([`/artist/${artistUrl}`]);
  }
}
