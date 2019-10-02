import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';

import {MatButtonModule, MatButtonToggleModule, MatRippleModule, MatSortModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {ArtComponent} from './components/art/art.component';
import {PopupArtComponent} from './components/art/popup-art/popup-art.component';
import {ComicsComponent} from './components/comics/comics.component';
import {ArtistDetailsComponent} from './components/details/artist-details/artist-details.component';
import {AuthorDetailsComponent} from './components/details/author-details/author-details.component';
import {ComicDetailsComponent} from './components/details/comic-details/comic-details.component';
import {CreditDetailsComponent} from './components/details/credit-details/credit-details.component';
import {MovieDetailsComponent} from './components/details/movie-details/movie-details.component';
import {SerieDetailsComponent} from './components/details/serie-details/serie-details.component';
import {MoviesComponent} from './components/movies/movies.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {TvComponent} from './components/series/series.component';
import {ButtonComponent} from './components/shared/button/button.component';
import {PortraitComponent} from './components/shared/portrait/portrait.component';
import {RatingComponent} from './components/shared/rating/rating.component';
import {SearchComponent} from './components/shared/search/search.component';
import {SpinnerComponent} from './components/shared/spinner/spinner.component';

const appRoutes: Routes = [
  {path: 'movies/:list', component: MoviesComponent},
  {path: 'movies', redirectTo: 'movies/top_rated', pathMatch: 'full'},
  {path: 'movie/:id', component: MovieDetailsComponent},
  {path: 'credit/:id', component: CreditDetailsComponent},
  {path: 'series/:list', component: TvComponent},
  {path: 'series', redirectTo: 'series/top_rated', pathMatch: 'full'},
  {path: 'serie/:id', component: SerieDetailsComponent},
  {path: 'art/:list', component: ArtComponent},
  {path: 'art', redirectTo: 'art/paintings', pathMatch: 'full'},
  {path: 'artist/:artistUrl', component: ArtistDetailsComponent},
  {path: 'comics', component: ComicsComponent},
  {path: 'comic/:id', component: ComicDetailsComponent},
  {path: 'author/:name', component: AuthorDetailsComponent},
  {path: '', redirectTo: 'art/paintings', pathMatch: 'full'},
  {path: '**', redirectTo: 'art/paintings', pathMatch: 'full'},
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
    ComicsComponent,
    ComicDetailsComponent,
    AuthorDetailsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatSortModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
