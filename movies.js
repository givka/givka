/*
API key      : K4g6YAAqn
Private key  : HARbbnt5S
*/

const Creator = require('./src/creator');

const c = new Creator();

c.eventNav();
c.createSeen();
//
// c.createArtists();
// c.createPeople(12);

// function getSC(movie) {
//   const google = require('google');
//   google.resultsPerPage = 1;
//   const sc = document.createElement('p');
//   movieDesc.appendChild(sc);
//   console
// .log(`${movie.title} ${parseInt(movie.release_date)}film senscritique`);

//   google(`${movie.title} ${parseInt(movie.release_date)} film senscritique`,
// (err, res) => {
//     if (err) console.error(err);
//     const link = res.links[0];
//     const rating = link.rating;
//     console.log('lol', rating, 'lol');
//     // var regex=/Rating: ([0-9.]*)\/10-([0-9,]*) votes/
//     const regexNote = /Rating: ([0-9.]*)\/10/;
//     const regexNumber = /([0-9,]*) votes/;
//     const note = regexNote.exec(rating)[1];
//     const number = regexNumber.exec(rating)[1];
//     const senscritique = {
//       note,
//       number,
//     };
//     console.log(senscritique);
//     sc.innerHTML = `${senscritique.note} ${senscritique.number}`;

//     return senscritique;
//   });
// }

// function createMovieTorrents(id) {
// const TorrentSearchApi = require('torrent-search-api');
//   getMovie(id, (movie) => {
//     const els = ['title', 'size', 'seeds', 'peers',
//       'time', 'link'];
//     const tableTorrent = document.createElement('table');
//     movieContent.appendChild(tableTorrent);
//     const trHeaders = document.createElement('tr');
//     for (const header of els) {
//       const th = document.createElement('th');
//       th.innerHTML = header;
//       trHeaders.appendChild(th);
//     }
//     tableTorrent.appendChild(trHeaders);

//     const torrentSearch = new TorrentSearchApi();
//     torrentSearch.enableProvider('YggTorrent', 'ketshi', 'arth1995');
//     torrentSearch
// .search(`${movie.title} ${parseInt(movie.release_date, 10)}`, 'Movies', 20)
//       .catch((err) => {
//         console.log(err);
//       })
//       .then((torrents) => {
//         for (const torrent of torrents) {
//           const trTorrent = document.createElement('tr');
//           for (const el of els) {
//             const td = document.createElement('td');
//             td.id = el;
//             if (el === 'link') {
//               const link = document.createElement('a');
//               link.href = torrent.link;
//               link.innerHTML = 'Download';
//               td.appendChild(link);
//             } else {
//               td.innerHTML = torrent[el];
//             }
//             trTorrent.appendChild(td);
//           }
//           tableTorrent.appendChild(trTorrent);
//         }
//       });
//   });
// }

