import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ArtComponent } from './components/art/art.component';
import { PopupArtComponent } from './components/art/popup-art/popup-art.component';
import { ArtistDetailsComponent } from
 './components/details/artist-details/artist-details.component';
import { CreditDetailsComponent } from
'./components/details/credit-details/credit-details.component';
import { MovieDetailsComponent } from './components/details/movie-details/movie-details.component';
import { SerieDetailsComponent } from './components/details/serie-details/serie-details.component';
import { MoviesComponent } from './components/movies/movies.component';
import { TvComponent } from './components/series/series.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { PortraitComponent } from './components/shared/portrait/portrait.component';
import { RatingComponent } from './components/shared/rating/rating.component';
import { SearchComponent } from './components/shared/search/search.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';

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
    SpinnerComponent,
    MovieDetailsComponent,
    CreditDetailsComponent,
    ButtonComponent,
    ArtComponent,
    ArtistDetailsComponent,
    PopupArtComponent,
    PortraitComponent,
    TvComponent,
    SerieDetailsComponent,
    SearchComponent,
    RatingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
