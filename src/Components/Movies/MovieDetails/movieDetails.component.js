angular.module('givka')
  .component('movieDetailsComponent', {
    bindings: {
      movie: '<',
    },
    templateUrl: 'Components/Movies/MovieDetails/movieDetails.component.html',
    controller: [class MovieDetailsComponent {
      $onChanges() {
        console.log(this.movie);
        this.movie.credits = this._formatCredits(this.movie.credits);
        console.log(this.movie.images);

        this.movie.images = this._formatImages(this.movie.images.backdrops);
        console.log(this.movie.credits);
      }

      _formatCredits(credits) {
        let directors = credits.crew;
        let actors = credits.cast;
        directors = directors.filter(crew => crew.job === 'Director');
        actors = actors.filter((cast, index) => index < 10 - directors.length);
        return directors.concat(actors);
      }

      _formatImages(images) {
        images = _.orderBy(images, e => e.vote_count, 'desc');
        images = images.slice(0, 5);
        console.log(images);

        return images;
      }
    }],

  });
