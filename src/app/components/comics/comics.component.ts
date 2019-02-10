import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComicSerie } from '../../classes/comic-serie';
import { BackgroundService } from '../../services/background.service';
import { ComicsService } from '../../services/comics.service';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComicsComponent implements OnInit {
  public loading = true;
  public series !: ComicSerie[];
  public list !: 'popular' | 'collection';

  public linkButtons = [
  { title: 'Popular', url:'/comics/popular' },
  { title: 'Collection', url:'/comics/collection' },
  ];

  constructor(private comicsAPI: ComicsService,
              private router: Router,
              private title: Title,
              private background: BackgroundService,
  ) { }

  public ngOnInit() {
    this.list = 'popular';
    this.title.setTitle('Comics');
    this.background.addRandomBackground();
    this.comicsAPI.getSeries()
    .then(result => this.series = result)
    .finally(() => this.loading = false);
  }

  public onClickComic(comic: any) {
    this.router.navigate([`/comic/${comic.serieId}`]);
  }

}
