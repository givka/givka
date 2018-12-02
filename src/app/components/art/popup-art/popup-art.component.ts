import {
  Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { findIndex } from 'lodash';
import { Painting } from '../../../classes/painting';
import { Storage } from '../../../classes/storage';

@Component({
  selector: 'popup-art-component',
  templateUrl: './popup-art.component.html',
  styleUrls: ['./popup-art.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PopupArtComponent implements OnInit {
  @Input() public paintings!: Painting[];

  @Input() public painting!: Painting;

  @Output() public onClose: EventEmitter<any> = new EventEmitter();

  public loading = true;

  public index!: number;

  public message!: string | null;

  constructor(private router: Router) { }

  public ngOnInit() {
    this.index = findIndex(this.paintings, this.painting);
  }

  public onImageLoad() {
    this.loading = false;
  }

  public changePainting(indexInc: number) {
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

  public showMessage(message: string) {
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

  public onClickArtist(artistUrl: string) {
    this.router.navigate([`/artist/${artistUrl}`]);
  }
}
