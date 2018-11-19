import {
  Component, OnInit, ViewEncapsulation, Input,
} from '@angular/core';

@Component({
  selector: 'rating-component',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class RatingComponent implements OnInit {
  @Input() voteAverage: number;

  @Input() voteCount: number;

  nbrOfStars = 5;

  stars = [];

  constructor() { }

  ngOnInit() {
    this.stars = Array.from(Array(this.nbrOfStars))
      .map((star, index) => {
        const starRating = index + 1 - this.voteAverage / 2;
        if (starRating <= 0) return 'fas fa-star';
        if (starRating <= 0.5) { return 'fas fa-star-half-alt'; }
        return 'far fa-star';
      });
  }
}
