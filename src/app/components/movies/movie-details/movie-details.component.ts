import {
  Component, Input, OnInit, ViewEncapsulation,
} from '@angular/core';
import { MovieDetails } from '../../../factories/movie-details';

@Component({
  selector: 'movie-details-component',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class MovieDetailsComponent implements OnInit {
  @Input() movie: MovieDetails;

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
