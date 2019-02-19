import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { random } from 'lodash';
import { Subscription } from 'rxjs';
import { ComicSerieDetails } from '../../../classes/comic-serie-details';
import { ComicsService } from '../../../services/comics.service';

@Component({
  selector: 'comic-details-component',
  templateUrl: './comic-details.component.html',
  styleUrls: ['./comic-details.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class ComicDetailsComponent implements OnInit {
  public subRouter!: Subscription;
  public serieDetails!: ComicSerieDetails;
  public loading = true;
  public background = `${random(0, 16)}.jpg`;

  constructor(private routeActive: ActivatedRoute,
              private router: Router,
              private comicsAPI: ComicsService,
              private title: Title,
              ) { }

  public ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { id } = routeParams;
      this.loadComicDetails(+id);
    });
  }

  public loadComicDetails(id: number) {
    this.loading = true;
    this.comicsAPI.getSerieDetails(id)
    .then((result) => {
      this.serieDetails = result;
      this.title.setTitle(`${this.serieDetails.serieTitle} - Givka`);
    })
    .finally(() => this.loading = false);
  }

  public onClickAuthor(name: string) {
    this.router.navigate([`/author/${name}`]);
  }

  public onClickSerie(id: number) {
    this.router.navigate([`/comic/${id}`]);
  }
  public onCloseComic() {
    this.router.navigate(['/comics']);
  }

}
