import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './services/electron.service';

import { AppComponent } from './app.component';

import { MoviesComponent } from './components/movies/movies.component';
import { MovieComponent } from './components/movies/movie/movie.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { MovieDetailsComponent } from './components/movies/movie-details/movie-details.component';
import { MovieListComponent } from './components/movies/movie-details/movie-list/movie-list.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { ArtComponent } from './components/art/art.component';
import { ArtistDetailsComponent } from './components/art/artist-details/artist-details.component';
import { PortraitsComponent } from './components/art/portraits/portraits.component';
import { PopupArtComponent } from './components/art/popup-art/popup-art.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
  AppComponent,
  MoviesComponent,
  MovieComponent,
  SpinnerComponent,
  MovieDetailsComponent,
  MovieListComponent,
  ButtonComponent,
  ArtComponent,
  ArtistDetailsComponent,
  PortraitsComponent,
  PopupArtComponent,
  ],
  imports: [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  TranslateModule.forRoot({
    loader: {
    provide: TranslateLoader,
    useFactory: (HttpLoaderFactory),
    deps: [HttpClient]
    }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
  })
export class AppModule { }
