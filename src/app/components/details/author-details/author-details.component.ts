import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {random} from 'lodash';
import {Subscription} from 'rxjs';
import {ComicAuthor} from '../../../classes/comic-author';
import {ComicsService} from '../../../services/comics.service';

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
  public background = `${random(0, 16)}.jpg`;

  constructor(private routeActive: ActivatedRoute,
              private router: Router,
              private comicsAPI: ComicsService,
              private title: Title,
  ) {
  }

  public ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const {name} = routeParams;
      this.loadComicAuthor(name);
    });
  }

  public loadComicAuthor(name: string) {
    this.comicsAPI.getAuthor(name)
      .then((result) => {
        this.author = result;
        this.title.setTitle(`${this.author.name} - Givka`);
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
