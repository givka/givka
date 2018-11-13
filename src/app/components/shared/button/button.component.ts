import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'button-component',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ButtonComponent {
  @Input() title: string;

  @Input() orderAsc: boolean;

  constructor() { }
}
