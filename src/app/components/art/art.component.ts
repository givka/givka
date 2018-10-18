import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { random } from 'lodash';
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

  constructor(private wikiart: WikiartService) { }

  ngOnInit() {
    this.loading = true;
    this.wikiart.getPopularPaintings(random(1, 100))
      .then((data) => {
        this.paintings = data;
      })
      .finally(() => { this.loading = false; });
  }

  onClickPainting(painting, $event) {
    this.showPopup = true;
    this.popupPainting = painting;
  }
}
