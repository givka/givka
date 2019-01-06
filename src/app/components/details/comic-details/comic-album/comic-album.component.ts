import {
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'comic-album-component',
  templateUrl: './comic-album.component.html',
  styleUrls: ['./comic-album.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComicAlbumComponent {
  @Input() public album: any;

  constructor(private router: Router) {}

  public onClickAuthor(name: string) {
    this.router.navigate([`/author/${name}`]);
  }
}
