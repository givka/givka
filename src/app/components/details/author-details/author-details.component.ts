import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComicAuthor } from '../../../classes/comic-author';
import { BackgroundService } from '../../../services/background.service';
import { ComicsService } from '../../../services/comics.service';

@Component({
  selector: 'author-details-component',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthorDetailsComponent implements OnInit {

  public subRouter!: Subscription;
  public author!: ComicAuthor;
  public loading = true;

  constructor(private routeActive: ActivatedRoute,
              private router: Router,
              private comicsAPI: ComicsService,
              private title: Title,
              private background: BackgroundService) { }

  public ngOnInit() {
    this.background.addRandomBackground();
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { name } = routeParams;
      this.loadComicAuthor(name);
    });
  }

  public loadComicAuthor(name: string) {
    this.comicsAPI.getAuthor(name)
    .then((result) => {
      this.author = result;
      this.title.setTitle(this.author.name);
    })
    .finally(() => this.loading = false);
  }

  public onCloseAuthor() {
    this.router.navigate(['/comics']);
  }

  public onClickComic(id: number) {
    this.router.navigate([`/comic/${id}`]);
  }

}
