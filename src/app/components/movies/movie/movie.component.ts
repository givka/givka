import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Movie } from '../../../factories/movie';
import { BroadcastService } from '../../../services/broadcast.service';

@Component({
  selector: 'movie-component',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MovieComponent {
  @Input() movie: Movie;

  @Input() size: number;

  constructor(private broadcast: BroadcastService) {

  }

  onClickPoster(movie, event) {
    this.broadcast.sendMovie(movie, event);
  }
}
