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

  stars = [];

  constructor() { }

  ngOnInit() {
    this.stars = Array.from(Array(10))
      .map((star, index) => {
        const starRating = index + 1;
        if (starRating <= this.voteAverage) return 'fas fa-star';
        if ((starRating - this.voteAverage > 0.25) && (starRating - this.voteAverage < 0.75)) {
          return 'fas fa-star-half-alt';
        }
        return 'far fa-star';
      });
  }
}
