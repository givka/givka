import {
  Component, Input, OnInit, ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'portrait-component',
  templateUrl: './portrait.component.html',
  styleUrls: ['./portrait.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PortraitComponent {
  @Input() public image!: string;
  @Input() public title!: string;
  @Input() public topTitle!: string;
  @Input() public width!: number;
}
