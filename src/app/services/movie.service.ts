import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Movie } from '../factories/movie';

@Injectable({ providedIn: 'root' })

export class MovieService {
  private subject = new Subject<any>();

  public sendMovie(movie: Movie, event) {
    this.subject.next({ movie, event });
  }

  getMovie(): Observable<any> {
    return this.subject.asObservable();
  }
}
