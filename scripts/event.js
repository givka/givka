const $ = require('jquery');
const MovieDataBase = require('./movie-database');
const JsonDataBase = require('./json-database');
const Creator = require('./creator');

const mdb = new MovieDataBase();
const jdb = new JsonDataBase();
const c = new Creator();

class Event {
  movieSeen() {
    document.getElementById('content')
      .addEventListener('click', (event) => {
        if (event.target.tagName !== 'IMG') { return; }
        const element = event.path[1];

        const id = element.classList[0];
        element.classList.toggle('viewed');
        setTimeout(() => {
          const divDelete = (`.${id}`);
          if (element.classList.length === 1) { return; }
          element.classList.toggle('animate');
          setTimeout(() => {
            $(divDelete).remove();
            c.updateColumn();
            mdb.getMovie(id, null)
              .then(movie => jdb.addKeyDB('movie', movie));
          }, 250);
        }, 5000);
      }, false);
  }
}

module.exports = Event;
