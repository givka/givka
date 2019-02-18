import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  public serie!: ComicSerieDetails;
  public loading = true;

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
    this.comicsAPI.getSerieDetails(id)
    .then((result) => {
      this.serie = result;
      this.title.setTitle(this.serie.serieTitle);
    })
    .finally(() => this.loading = false);
  }

  public onCloseComic() {
    this.router.navigate(['/comics']);
  }

}
