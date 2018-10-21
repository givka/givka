import {
  Component, Input, ViewEncapsulation,
} from '@angular/core';
import { Painting } from '../../../factories/painting';
import { Artist } from '../../../factories/artist';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'portraits-component',
  templateUrl: './portraits.component.html',
  styleUrls: ['./portraits.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class PortraitsComponent {
  @Input() portraits: Painting[] | Artist[]

  constructor(private broadcast: BroadcastService) { }

  onClickPortrait(portrait, $event) {
    this.broadcast.sendPortrait(portrait, $event);
  }
}
