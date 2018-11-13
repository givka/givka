import {
  Component, OnInit, ViewEncapsulation, Input,
} from '@angular/core';
import { Artist } from '../../../factories/artist';

@Component({
  selector: 'artist-details-component',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ArtistDetailsComponent implements OnInit {
  @Input() artist: Artist

  constructor() { }

  ngOnInit() {
  }
}
