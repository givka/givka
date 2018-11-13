import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { MoviesComponent } from './components/movies/movies.component';
import { MovieComponent } from './components/movies/movie/movie.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { MovieDetailsComponent } from './components/movies/movie-details/movie-details.component';
import { CreditDetailsComponent } from './components/movies/credit-details/credit-details.component';
import { MovieListComponent } from './components/movies/movie-details/movie-list/movie-list.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { ArtComponent } from './components/art/art.component';
import { ArtistDetailsComponent } from './components/art/artist-details/artist-details.component';
import { PortraitsComponent } from './components/art/portraits/portraits.component';
import { PopupArtComponent } from './components/art/popup-art/popup-art.component';
import { PortraitComponent } from './components/shared/portrait/portrait.component';


@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    MovieComponent,
    SpinnerComponent,
    MovieDetailsComponent,
    CreditDetailsComponent,
    MovieListComponent,
    ButtonComponent,
    ArtComponent,
    ArtistDetailsComponent,
    PortraitsComponent,
    PopupArtComponent,
    PortraitComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
