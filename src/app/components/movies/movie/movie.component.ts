import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from 'src/app/factories/storage';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { Movie } from '../../../factories/movie';

@Component({
  selector: 'movie-component',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  encapsulation: ViewEncapsulation.None
  })

export class MovieComponent {
  @Input() movie: Movie;

  @Input() size: number;

  constructor(
    private router: Router,
    private broadcast: BroadcastService,
  ) {

  }

  onClickPoster(movie, event) {
    if (event.ctrlKey || event.metaKey) {
      const isFromMovieDetails = this.router.url.includes('movie/');
      isFromMovieDetails ? this.broadcast.sendMovie(movie) : movie.toggleSeen(movie);
      movie.seen ? Storage.addKeyDB('movie', movie) : Storage.deleteKeyDB('movie', movie);
    } else {
      this.router.navigate([`movie/${movie.id}`]);
    }
  }
}
