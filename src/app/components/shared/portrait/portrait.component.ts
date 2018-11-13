import {
  Component, Input, ViewEncapsulation, OnInit,
} from '@angular/core';

@Component({
  selector: 'portrait-component',
  templateUrl: './portrait.component.html',
  styleUrls: ['./portrait.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class PortraitComponent implements OnInit {
  @Input() image: string;

  @Input() title: string;

  @Input() topTitle: string;

  isHover = false;

  showImage = false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.showImage = true;
    }, 0);
  }
}
