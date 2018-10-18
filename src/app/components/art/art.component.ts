import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { random, findIndex } from 'lodash';
import { WikiartService } from '../../services/wikiart.service';
import { Painting } from '../../factories/painting';

@Component({
  selector: 'art-component',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ArtComponent implements OnInit {
  paintings: any

  showPopup: boolean = false;

  loading: boolean = true;

  popupPainting: Painting;

  popupIndex: number;

  popupLoading: boolean = true;

  constructor(private wikiart: WikiartService) { }

  ngOnInit() {
    this.loading = true;
    this.wikiart.getPopularPaintings()
      .then((data) => {
        this.paintings = data;
      })
      .finally(() => { this.loading = false; });
  }

  onClickPainting(painting, $event) {
    this.showPopup = true;

    this.popupPainting = painting;
    this.popupIndex = findIndex(this.paintings, painting);
  }

  popupChangePainting(index: number) {
    this.popupLoading = true;
    if (index > 0) {
      if (this.popupIndex === this.paintings.length) {
        this.popupIndex = 0;
      } else {
        this.popupIndex++;
      }
    } else if (this.popupIndex === 0) {
      this.popupIndex = this.paintings.length;
    } else {
      this.popupIndex--;
    }

    this.popupPainting = this.paintings[this.popupIndex];
    console.log(this.popupPainting);
  }

  onImageLoad() {
    this.popupLoading = false;
  }
}
