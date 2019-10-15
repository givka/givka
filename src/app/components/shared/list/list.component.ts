import {Component, Input, OnInit} from '@angular/core';
import {Movie} from '../../../classes/movie';
import {Sort} from '@angular/material';
import {Utils} from '../../../classes/utils';
import {UtilityService} from '../../../services/utility.service';
import {MovieDetails} from '../../../classes/movie-details';
import {SerieDetails} from '../../../classes/serie-details';
import {Serie} from '../../../classes/serie';
import {CreditDetails} from '../../../classes/credit-details';

@Component({
  selector: 'list-component',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() title!: string;
  @Input() type!: 'series' | 'movies';

  @Input() itemDetails!: MovieDetails | SerieDetails | CreditDetails;
  @Input() items!: Movie[] | Serie[];

  public sortedItems!: Movie[] | Serie[];
  public sortActive = '';
  public sortButtons = [
    {title: 'Title', key: 'title'},
    {title: 'Release Date', key: 'releaseDate'},
    {title: 'Vote Count', key: 'voteCount'},
    {title: 'Vote Average', key: 'voteAverage'},
  ];

  constructor(public utility: UtilityService) {
  }

  ngOnInit() {
    this.sortedItems = this.items.slice();
  }

  public sort(sort: Sort) {
    if (sort.direction === '') {
      this.sortedItems = this.items.slice();
      this.sortActive = '';
      return;
    }
    this.sortActive = sort.active;
    this.sortedItems = Utils.orderBy(this.items, sort.active, sort.direction);
  }

}
