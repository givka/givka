import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComicSerie } from '../../classes/comic-serie';
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
  public loadingAdd = false;
  public after: number | null  = null;

  public linkButtons = [
  { title: 'Popular', url:'/comics/popular' },
  { title: 'Collection', url:'/comics/collection' },
  ];

  constructor(private comicsAPI: ComicsService,
              private router: Router,
              private title: Title,
  ) { }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll() {
    const max = document.documentElement!.scrollHeight - document.documentElement!.clientHeight;
    const pos = document.documentElement!.scrollTop;

    if (this.list !== 'collection' && !this.loadingAdd && pos === max) {
      this.addComics();
    }
  }

  public ngOnInit() {
    this.list = 'popular';
    this.title.setTitle('Franco-Belgian Comics - Givka');
    this.comicsAPI.getSeries(this.after)
    .then((result) => {
      this.after = result.after;
      this.series = result.series;
    })
    .finally(() => this.loading = false);
  }

  public addComics() {
    this.loadingAdd = true;

    this.comicsAPI.getSeries(this.after)
      .then((result) => {
        this.after = result.after;
        this.series = this.series.concat(result.series);
      })
      .finally(() => { this.loadingAdd = false; });
  }

  public onClickComic(comic: any) {
    this.router.navigate([`/comic/${comic.serieId}`]);
  }

}
