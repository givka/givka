import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComicAlbum } from '../../classes/comic-album';
import { BackgroundService } from '../../services/background.service';
import { ComicsService } from '../../services/comics.service';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
})
export class ComicsComponent implements OnInit {
  public loading = true;
  public comics !: ComicAlbum[];

  constructor(private comicsAPI: ComicsService,
              private router: Router,
              private title: Title,
              private background: BackgroundService,
  ) { }

  public ngOnInit() {
    this.title.setTitle('Comics');
    this.background.addRandomBackground();
    this.comicsAPI.getAlbums()
    .then(result => this.comics = result)
    .finally(() => this.loading = false);
  }

  public onClickComic(comic: any) {
    this.router.navigate([`/comic/${comic.serieId}`]);
  }

}
