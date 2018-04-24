
const movies = `
<div id=movies>
  {{#each items}}
    <div id=id-{{this.id}} class="container {{this.seen}}">
      <img src=https://image.tmdb.org/t/p/w342{{this.poster_path}}>
    </div>
  {{/ each}}
</div>
`;

const trailer = `<iframe width="560" height="315" 
src = "https://www.youtube.com/embed/{{key}}?rel=0&amp;showinfo=0"
frameborder = "0" allow = "autoplay; encrypted-media"
allowfullscreen ></iframe >`;

const collection = `
{{#each items}}
<div id="id-{{this.id}}" class="movie-reco {{this.classname}}">
  <img src="https://image.tmdb.org/t/p/w342{{this.poster_path}}">
  <div id=ratiovote 
    style="width: {{this.voteWidth}}%; background: {{this.voteColor}};">
  </div>
</div>
{{/ each}}`;

const reco = `
{{#each items}}
  <div id=id-{{this.id}} class="movie-reco {{this.classname}}">
  <img src="https://image.tmdb.org/t/p/w342{{this.poster_path}}">
  <div id=ratiovote 
  style="width: {{this.voteWidth}}%; background: {{this.voteColor}};">
  </div>
  </div>
{{/ each}}`;

const images = `
{{#each items}}
  <div class="movie-image">
    <img src="https://image.tmdb.org/t/p/w780{{this.file_path}}"> 
  </div>
{{/ each}}`;

const credits = `{{#each items}}
<div id="id-{{this.id}}" class="movie-credit">
  <img src="{{creditImage}}"> 
  <div id="credit-info">
    <p id="credit-job">{{creditJob}}</p>
    <p id="credit-name">{{this.name}}</p>
  </div>
</div>
{{/ each}}`;

const details = `
<div id=movie-details class=main-container>
  <div id="movie-background" class=parallax-container>
    <h1 id="movie-title">{{title}}</h1>
  </div>
  <div id=movie-details-panel class=content-container>
  <div id="movie-bar">
    <div id="movie-image">
      <img src="https://image.tmdb.org/t/p/w500{{poster}}">
    </div>
    <div id="movie-description">
      <h1 id="movie-title">{{title}}</h1>
      <h2 id="movie-original-title">{{originalTitle}}</h2>
      <p id="date">{{date}}</p>
      <p id="runtime">{{runtime}}</p>
      <p id="overview">{{overview}}</p>
      <p id="voteaverage">{{voteAverage}}</p>
      <p id="votecount">{{voteCount}}</p>
    </div>
  </div>
  <h3>Credits</h3>
  <div id="movie-credits">
  </div>
  <h3>Images</h3>
  <div id="movie-images">
  </div>
  <div id="movie-recommendations">
  </div>
  {{#if hasCollection}}
    <div id="movie-collection">
    </div>
  {{/if}}
  </div>
</div>
`;

const people = `
<div id=people details class=main-container>
  <div id="people-background" class=parallax-container>
    <h1 id="people-name">{{name}}</h1>
  </div>
  <div id=people-details-panel class=content-container>
  <div id="people-bar">
    <div id="people-image">
      <img src="https://image.tmdb.org/t/p/w500{{poster}}">
    </div>
    <div id="people-description">
      <h1 id="people-name">{{name}}</h1>
      <p id="date">{{birthday}}</p>
      <p id="biography">{{biography}}</p>
    </div>
  </div>
  <div id=people-list-content>
  </div>
</div>
`;

const list = `
<div id=people-list>
  {{#each items}}
    <div id=id-{{this.id}} class="movie-reco {{this.classname}}">  
      <img src="https://image.tmdb.org/t/p/w342{{this.poster_path}}">
    </div>
  {{/ each}}
</div>`;

class Template {
  static list() {
    return list;
  }
  static people() {
    return people;
  }
  static details() {
    return details;
  }
  static images() {
    return images;
  }
  static credits() {
    return credits;
  }
  static reco() {
    return reco;
  }
  static collection() {
    return collection;
  }
  static trailer() {
    return trailer;
  }
  static movies() {
    return movies;
  }
}

module.exports = Template;
