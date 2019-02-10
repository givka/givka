import {
  Component, Input, OnInit, ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'rating-component',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RatingComponent implements OnInit {
  @Input() public voteAverage!: number;
  @Input() public voteCount!: number;
  @Input() public voteMax!: number;
  public nbrOfStars = 5;
  public stars!: string[];

  public ngOnInit() {
    const voteAverage = this.voteAverage / this.voteMax;
    this.stars = Array.from(Array(this.nbrOfStars))
      .map((star, index) => {
        const starRating = index + 1 - (voteAverage * 10) / 2;
        if (starRating <= 0) return 'star';
        if (starRating <= 0.5) { return 'star_half'; }
        return 'star_border';
      });
  }
}
