import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { MoviesComponent } from './components/movies/movies.component';
import { MovieComponent } from './components/movies/movie/movie.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { MovieDetailsComponent } from './components/movies/movie-details/movie-details.component';
import { CreditDetailsComponent } from './components/movies/credit-details/credit-details.component';

import { ButtonComponent } from './components/shared/button/button.component';
import { ArtComponent } from './components/art/art.component';
import { ArtistDetailsComponent } from './components/art/artist-details/artist-details.component';
import { PortraitsComponent } from './components/art/portraits/portraits.component';
import { PopupArtComponent } from './components/art/popup-art/popup-art.component';
import { PortraitComponent } from './components/shared/portrait/portrait.component';
import { TvComponent } from './components/series/series.component';
import { SerieDetailsComponent } from './components/series/serie-details/serie-details.component';

const appRoutes: Routes = [
  { path: 'movies/:list', component: MoviesComponent },
  { path: 'movies', redirectTo: 'movies/collection', pathMatch: 'full' },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'credit/:id', component: CreditDetailsComponent },
  { path: 'series/:list', component: TvComponent },
  { path: 'series', redirectTo: 'series/collection', pathMatch: 'full' },
  { path: 'serie/:id', component: SerieDetailsComponent },
  { path: 'art/:list', component: ArtComponent },
  { path: 'art', redirectTo: 'art/collection', pathMatch: 'full' },
  { path: 'artist/:artistUrl', component: ArtistDetailsComponent },
  { path: '', redirectTo: 'movies/collection', pathMatch: 'full' },

];

@NgModule({
  declarations: [
  AppComponent,
  MoviesComponent,
  MovieComponent,
  SpinnerComponent,
  MovieDetailsComponent,
  CreditDetailsComponent,
  ButtonComponent,
  ArtComponent,
  ArtistDetailsComponent,
  PortraitsComponent,
  PopupArtComponent,
  PortraitComponent,
  TvComponent,
  SerieDetailsComponent,
  ],
  imports: [
  BrowserModule,
  HttpClientModule,
  RouterModule.forRoot(appRoutes)

  ],
  providers: [],
  bootstrap: [AppComponent]
  })
export class AppModule { }
