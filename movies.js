/*
API key      : K4g6YAAqn
Private key  : HARbbnt5S
*/

const TorrentSearchApi = require('torrent-search-api');

const Creator = require('./scripts/creator');

const c = new Creator();

c.createColumns(9);
c.eventNav();
c.createSeen();

// c.createDiscover('popular');
// ev.nav();

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

