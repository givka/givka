import {
  Component, OnInit, ViewEncapsulation, OnDestroy,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Movie } from '../../factories/movie';
import { MovieDetails } from '../../factories/movie-details';
import { Storage } from '../../factories/storage';

import { TmdbService } from '../../services/tmdb.service';
import { Utils } from '../../factories/utils';

@Component({
  selector: 'movies-component',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  encapsulation: ViewEncapsulation.None
  })

export class MoviesComponent implements OnInit, OnDestroy {
  movies: Movie[];

  loading = true;

  subRouter: Subscription;

  list: string;

  orderAsc = {
    title: true, releaseDate: true, voteAverage: false, voteCount: false,
  };

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private title: Title,
  ) { }

  ngOnInit() {
    this.title.setTitle('Movies');
    this.subRouter = this.routeActive.params.subscribe((params) => {
      this.loadList(params.list);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  loadList(list: string) {
    const possibleLists = ['upcoming', 'top_rated', 'popular', 'collection'];
    if (!possibleLists.includes(list)) {
      this.router.navigate(['movies']);
      return;
    }

    this.list = list;
    this.loading = true;
    if (list === 'collection') {
      const seen = Storage.readDB('movies');
      this.movies = Object.keys(seen)
        .map(movie => new Movie(seen[movie], seen));
      this.loading = false;
    } else {
      this.tmdb.getDiscoverMovies(list)
        .then((movies) => { this.movies = movies; })
        .finally(() => { this.loading = false; });
    }
  }

  onClickMovie(movie: Movie, event) {
    if (event.ctrlKey || event.metaKey) {
      movie.toggleSeen();
      movie.seen ? Storage.addKeyDB('movies', movie) : Storage.deleteKeyDB('movies', movie);
    } else {
      this.router.navigate([`movie/${movie.id}`]);
    }
  }

  orderBy(key) {
    const order = this.orderAsc[key] ? 'asc' : 'desc';
    this.orderAsc[key] = !this.orderAsc[key];
    this.loading = true;
    this.movies = Utils.orderBy(this.movies, key, order);
    this.loading = false;
  }
}
