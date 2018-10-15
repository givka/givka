import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Movie } from '../../../factories/movie';
import { MovieService } from '../../../services/movie.service';

@Component({
  selector: 'movie-component',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  encapsulation: ViewEncapsulation.None
  })

export class MovieComponent {
  @Input() movie: Movie;

  @Input() size: number

  constructor(private movieService: MovieService) {

  }

  onClickPoster(movie, event) {
    this.movieService.sendMovie(movie, event);
  }
}
