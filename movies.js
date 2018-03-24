/*
API key      : K4g6YAAqn
Private key  : HARbbnt5S
*/

const storage = require('electron-json-storage');
const TorrentSearchApi = require('torrent-search-api');
const $ = require('jquery');

const MovieDataBase = require('./scripts/movie-database');
const Creator = require('./scripts/creator');
const JsonDataBase = require('./scripts/json-database');

const mdb = new MovieDataBase();
const c = new Creator();
const jdb = new JsonDataBase();

// c.columns(9)
(mdb.getMovie('11').then(movie => console.log(movie)));
c.createCollection('10');

function movieSeen() {
  const h1 = document.createElement('h1');
  h1.innerHTML = 'Movies Seen';
  h1.id = 'title';
  const divArtists = document.createElement('div');
  divArtists.id = 'movies';
  document.getElementById('content').appendChild(h1);
  document.getElementById('content').appendChild(divArtists);
  let div = document.createElement('div');
  div.id = 'row';
  let src = document.getElementById('movies');
  src.appendChild(div);
  src = document.getElementById('row');
  const nbrColumns = 7;
  for (let b = 1; b <= nbrColumns; b += 1) {
    div = document.createElement('div');
    div.id = 'column';
    div.className = `columnId-${b.toString()}`;
    src.appendChild(div);
  }
  dates = [];
  storage.keys((error, keys) => {
    if (error) throw error;
    for (const key of keys) {
      storage.get(key, (error, data) => {
        if (error) throw error;
        result = data;
        // date = parseInt(data.release_date)
        // dates.indexOf(date) === -1 ? dates.push(date) : console.log("This item already exists");
        // dates.sort(function (a, b) {
        //     return a < b ? -1 : a > b ? 1 : 0;
        // });
        // console.log(dates)
        const divLocal = document.createElement('div');
        divLocal.id = 'container';
        divLocal.className = result.id;
        // var divName = document.createElement("div");
        // divName.innerHTML = result.title;
        // divName.className = "bottom"
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
        // img.id = index * a;
        divLocal.appendChild(img);
        // divLocal.appendChild(divName)
        minColumn(nbrColumns, (minC) => {
          const divColumn = document.getElementsByClassName(`columnId-${minC.toString()}`)[0];
          divColumn.appendChild(divLocal);
        });
      });
    }
  });
  addMovieListenerGetMovieDetails();
}

function addMovieListenerGetCollection() {
  document.getElementById('movies').addEventListener('click', (event) => {
    const element = event.path[1];
    document.getElementById('content').style.display = 'none';
    getMovie(element.classList[0], (movie) => {
      createCollection(movie.belongs_to_collection.id);
    });
  });
}

function addMovieListenerViewed() {
  document.getElementById('movies').addEventListener('click', (event) => {
    const element = event.path[1];
    element.classList.toggle('viewed');
    setTimeout(() => {
      const divDelete = (`.${element.classList[0]}`);
      // if class.length ===1 return
      if (element.classList.length === 1) { return; }
      element.classList.toggle('animate');
      setTimeout(() => {
        $(divDelete).remove();
        getMovie(element.classList[0], (movie) => {
          storage.set(element.classList[0], movie, (error) => {
            if (error) throw error;
            console.log('done');
          });
        });
      }, 800);
    }, 5000);
  });
}

function addMovieListenerGetMovieDetails() {
  document.getElementById('movies').addEventListener('click', (event) => {
    const element = event.path[1];
    // element.classList.toggle("viewed")
    document.getElementById('content').style.display = 'none';
    mdb.getMovie(element.className)
      .then((movie) => {
        const movieContent = document.createElement('div');
        movieContent.id = 'movieContent';
        document.body.appendChild(movieContent);
        const MovieBar = document.createElement('div');
        MovieBar.id = 'MovieBar';
        const movieImg = document.createElement('div');
        movieImg.id = 'movieImg';
        const movieDesc = document.createElement('div');
        movieDesc.id = 'movieDesc';
        // divArtist.style.background="url("+data[number].image+")"
        const bg = `${'url(' + 'https://image.tmdb.org/t/p/w500'}${movie.backdrop_path})`;
        const str = "content: \'\';  top: 0; bottom:0; left: 0; right: 0; z-index: -1; padding: 0;";
        // str+='filter: blur(10px); '+"background: " + bg + " fixed 0 0;background-size: cover;background-position: 50% 50%; position: absolute; ";
        document.styleSheets[0].addRule('#MovieBar:before', str);
        const h1 = document.createElement('h1');
        h1.innerHTML = `${movie.title} (${parseInt(movie.release_date, 10)})`;
        h1.id = 'title';
        const h2 = document.createElement('h2');
        if (movie.title !== movie.original_title) {
          h2.innerHTML = `(${movie.original_title})`;
        }
        h2.id = 'original_title';
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const runtime = document.createElement('p');
        runtime.innerHTML = convertRuntime(movie.runtime);
        const overview = document.createElement('p');
        overview.innerHTML = movie.overview;
        movieDesc.appendChild(h1);
        movieDesc.appendChild(h2);
        movieDesc.appendChild(runtime);
        movieDesc.appendChild(overview);
        movieImg.appendChild(img);
        MovieBar.appendChild(movieImg);
        MovieBar.appendChild(movieDesc);
        document.getElementById('movieContent').appendChild(MovieBar);
        const els = ['imdb_id', 'belongs_to_collection',
          'release_date', 'vote_average', 'vote_count'];
        for (const el of els) {
          const p = document.createElement('p');
          p.id = el;
          p.innerHTML = `${el}: ${movie[el]}`;
          movieDesc.appendChild(p);
        }
        console.log('collection', movie.belongs_to_collection);

        // createMovieImages(element.className)
        // createMovieCastCrew(element.className)
        // createMovieTorrents(element.className)
        // createMovieTrailer(element.className)
      });
  });
}

function getSC(movie) {
  const google = require('google');
  google.resultsPerPage = 1;
  const sc = document.createElement('p');
  movieDesc.appendChild(sc);
  console.log(`${movie.title} ${parseInt(movie.release_date)}film senscritique`);

  google(`${movie.title} ${parseInt(movie.release_date)} film senscritique`, (err, res) => {
    if (err) console.error(err);
    const link = res.links[0];
    const rating = link.rating;
    console.log('lol', rating, 'lol');
    // var regex=/Rating: ([0-9.]*)\/10 - ([0-9,]*) votes/
    const regexNote = /Rating: ([0-9.]*)\/10/;
    const regexNumber = /([0-9,]*) votes/;
    const note = regexNote.exec(rating)[1];
    const number = regexNumber.exec(rating)[1];
    const senscritique = {
      note,
      number,
    };
    console.log(senscritique);
    sc.innerHTML = `${senscritique.note} ${senscritique.number}`;

    return senscritique;
  });
}

function createMovieTorrents(id) {
  getMovie(id, (movie) => {
    const els = ['title', 'size', 'seeds', 'peers',
      'time', 'link'];
    const tableTorrent = document.createElement('table');
    movieContent.appendChild(tableTorrent);
    const trHeaders = document.createElement('tr');
    for (const header of els) {
      const th = document.createElement('th');
      th.innerHTML = header;
      trHeaders.appendChild(th);
    }
    tableTorrent.appendChild(trHeaders);

    const torrentSearch = new TorrentSearchApi();
    torrentSearch.enableProvider('YggTorrent', 'ketshi', 'arth1995');
    torrentSearch.search(`${movie.title} ${parseInt(movie.release_date, 10)}`, 'Movies', 20)
      .catch((err) => {
        console.log(err);
      })
      .then((torrents) => {
        for (const torrent of torrents) {
          const trTorrent = document.createElement('tr');
          for (const el of els) {
            const td = document.createElement('td');
            td.id = el;
            if (el === 'link') {
              const link = document.createElement('a');
              link.href = torrent.link;
              link.innerHTML = 'Download';
              td.appendChild(link);
            } else {
              td.innerHTML = torrent[el];
            }
            trTorrent.appendChild(td);
          }
          tableTorrent.appendChild(trTorrent);
        }
      });
  });
}

function createMovieImages(id) {
  getMovieImages(id, (data) => {
    // for (const poster of data.posters) {
    //     var img=document.createElement('img')
    //     img.src="https://image.tmdb.org/t/p/w500" + poster.file_path
    //     img.width=200;
    //     movieContent.appendChild(img)
    // }
    for (const backdrop of data.backdrops) {
      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w500${backdrop.file_path}`;
      img.width = 400;
      movieContent.appendChild(img);
    }
  });
}

function createMovieCastCrew(id) {
  getMovieCastCrew(id, (data) => {
    const divCast = document.createElement('div');
    divCast.id = 'divCast';
    const divCrew = document.createElement('div');
    divCrew.id = 'divCrew';
    let index = 0;
    let divC;
    let name,
      img;
    for (const cast of data.cast) {
      if (index === 10) { break; }
      divC = document.createElement('div');
      divC.id = 'cast';
      img = document.createElement('img');
      if (cast.profile_path === null) {
        img.src = 'images/no-profile.png';
      } else {
        img.src = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
      }
      const character = document.createElement('p');
      character.innerHTML = cast.character;
      name = document.createElement('p');
      name.innerHTML = cast.name;
      divC.appendChild(character);
      divC.appendChild(img);
      divC.appendChild(name);
      index++;
      divCast.appendChild(divC);
    }
    let indexCrew = 0;
    for (const crew of data.crew) {
      if (indexCrew === 10) { break; }
      divC = document.createElement('div');
      divC.id = 'crew';
      img = document.createElement('img');
      if (crew.profile_path === null) {
        img.src = 'no_profile.png';
      } else {
        img.src = `https://image.tmdb.org/t/p/w185${crew.profile_path}`;
      }
      const job = document.createElement('p');
      job.innerHTML = crew.job;
      name = document.createElement('p');
      name.innerHTML = crew.name;
      divC.appendChild(job);
      divC.appendChild(img);
      divC.appendChild(name);
      divCrew.appendChild(divC);
      indexCrew++;
    }
    movieContent.appendChild(divCast);
    movieContent.appendChild(divCrew);
  });
}

