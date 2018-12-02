import {
  Component, Input, OnInit, ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'portrait-component',
  templateUrl: './portrait.component.html',
  styleUrls: ['./portrait.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PortraitComponent implements OnInit {
  @Input() public image!: string;

  @Input() public title!: string;

  @Input() public topTitle!: string;

  public isHover = false;

  public showImage = false;

  public ngOnInit() {
    setTimeout(() => {
      this.showImage = true;
    },         0);
  }
}
