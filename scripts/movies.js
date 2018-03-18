/*
API key      : K4g6YAAqn
Private key  : HARbbnt5S
*/
var LANGUAGE = 'en-US'
var API_KEY = 'aa79a25e783821b082e1e241e41889db';
const storage = require('electron-json-storage');
var request = require("request");
var rp = require('request-promise')
window.$ = window.jQuery = require("jquery")

var movieDataBase = require('/Users/artich/Desktop/Givka/scripts/tmdb.js')
const mdb = new movieDataBase()

var id = 422837

mdb.getRequests('popular', 5)
    .then((response) => {
        console.log(response);

    })

function movie() {
    var h1 = document.createElement("h1");
    h1.innerHTML = "Movies";
    h1.id = "title";
    var divArtists = document.createElement("div");
    divArtists.id = "movies";
    document.getElementById("content").appendChild(h1);
    document.getElementById("content").appendChild(divArtists);
    var div = document.createElement("div");
    div.id = "row"
    var src = document.getElementById("movies");
    src.appendChild(div)
    src = document.getElementById("row");
    var nbrColumns = 7;
    for (let b = 1; b <= nbrColumns; b++) {
        div = document.createElement("div");
        div.id = "column"
        div.className = "columnId-" + b.toString();
        src.appendChild(div)
    }
    var url = 'https://api.themoviedb.org/3/movie/top_rated'
    getRequest(url, function (results) {
        for (const result of results) {
            storage.has(result.id.toString(), function (error, hasKey) {
                if (error) throw error;
                if (hasKey) {
                }
                else {
                    // expected output: [object Promise]
                    var divLocal = document.createElement("div");
                    divLocal.id = "container";
                    divLocal.className = result.id;
                    // var divName = document.createElement("div");
                    // divName.innerHTML = result.title;
                    // divName.className = "bottom"
                    var img = document.createElement("img");
                    img.src = "https://image.tmdb.org/t/p/w500" + result.poster_path;
                    //img.id = index * a;
                    divLocal.appendChild(img)
                    // divLocal.appendChild(divName)
                    minColumn(nbrColumns, function (minC) {
                        var divColumn = document.getElementsByClassName("columnId-" + minC.toString())[0];
                        divColumn.appendChild(divLocal)
                    })
                }
            })
        }
        //addMovieListenerViewed()
        //addMovieListenerGetMovieDetails()
    })
    //MAYBE DO LOOP OF DOREQUEST AND PUSH EACH RESULT DUNNO TIRED
}

function movieSeen() {
    var h1 = document.createElement("h1");
    h1.innerHTML = "Movies Seen";
    h1.id = "title";
    var divArtists = document.createElement("div");
    divArtists.id = "movies";
    document.getElementById("content").appendChild(h1);
    document.getElementById("content").appendChild(divArtists);
    var div = document.createElement("div");
    div.id = "row"
    var src = document.getElementById("movies");
    src.appendChild(div)
    src = document.getElementById("row");
    var nbrColumns = 7;
    for (let b = 1; b <= nbrColumns; b++) {
        div = document.createElement("div");
        div.id = "column"
        div.className = "columnId-" + b.toString();
        src.appendChild(div)
    }
    dates = [];
    storage.keys(function (error, keys) {
        if (error) throw error;
        for (var key of keys) {
            storage.get(key, function (error, data) {
                if (error) throw error;
                result = data
                // date = parseInt(data.release_date)
                // dates.indexOf(date) === -1 ? dates.push(date) : console.log("This item already exists");
                // dates.sort(function (a, b) {
                //     return a < b ? -1 : a > b ? 1 : 0;
                // });
                // console.log(dates)
                var divLocal = document.createElement("div");
                divLocal.id = "container";
                divLocal.className = result.id;
                // var divName = document.createElement("div");
                // divName.innerHTML = result.title;
                // divName.className = "bottom"
                var img = document.createElement("img");
                img.src = "https://image.tmdb.org/t/p/w500" + result.poster_path;
                //img.id = index * a;
                divLocal.appendChild(img)
                // divLocal.appendChild(divName)
                minColumn(nbrColumns, function (minC) {
                    var divColumn = document.getElementsByClassName("columnId-" + minC.toString())[0];
                    divColumn.appendChild(divLocal)
                })
            });
        }
    });
    addMovieListenerGetMovieDetails()
}

function addMovieListenerGetCollection() {
    document.getElementById("movies").addEventListener("click", function (event) {
        var element = event.path[1]
        document.getElementById('content').style.display = 'none';
        getMovie(element.classList[0], function (movie) {
            createCollection(movie.belongs_to_collection.id);
        })
    });
}

function addMovieListenerViewed() {
    document.getElementById("movies").addEventListener("click", function (event) {
        var element = event.path[1]
        element.classList.toggle("viewed")
        setTimeout(function () {
            var divDelete = ('.' + element.classList[0]);
            //if class.length ===1 return
            if (element.classList.length === 1)
                return
            element.classList.toggle("animate")
            setTimeout(function () {
                $(divDelete).remove();
                getMovie(element.classList[0], function (movie) {
                    storage.set(element.classList[0], movie, function (error) {
                        if (error) throw error;
                        console.log('done');
                    });
                })
            }, 800);
        }, 5000);
    });
}

function addMovieListenerGetMovieDetails() {
    document.getElementById("movies").addEventListener("click", function (event) {
        var element = event.path[1]
        //element.classList.toggle("viewed")
        document.getElementById('content').style.display = 'none'
        getMovie(element.className, function (movie) {
            var movieContent = document.createElement("div");
            movieContent.id = "movieContent"
            document.body.appendChild(movieContent);
            var MovieBar = document.createElement("div")
            MovieBar.id = "MovieBar"
            var movieImg = document.createElement("div")
            movieImg.id = "movieImg"
            var movieDesc = document.createElement("div")
            movieDesc.id = "movieDesc"
            //divArtist.style.background="url("+data[number].image+")"
            var bg = "url(" + "https://image.tmdb.org/t/p/w500" + movie.backdrop_path + ")"
            var str = "content: \'\';  top: 0; bottom:0; left: 0; right: 0; z-index: -1; padding: 0;";
            //str+='filter: blur(10px); '+"background: " + bg + " fixed 0 0;background-size: cover;background-position: 50% 50%; position: absolute; ";
            document.styleSheets[0].addRule('#MovieBar:before', str);
            var h1 = document.createElement("h1");
            h1.innerHTML = movie.title + ' (' + parseInt(movie.release_date) + ')';
            h1.id = "title";
            var h2 = document.createElement("h2");
            if (movie.title !== movie.original_title) {
                h2.innerHTML = '(' + movie.original_title + ')';
            }
            h2.id = "original_title";
            var img = document.createElement("img");
            img.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path
            var runtime = document.createElement("p");
            runtime.innerHTML = convertRuntime(movie.runtime);
            var overview = document.createElement("p");
            overview.innerHTML = movie.overview;
            movieDesc.appendChild(h1);
            movieDesc.appendChild(h2);
            movieDesc.appendChild(runtime);
            movieDesc.appendChild(overview);
            movieImg.appendChild(img);
            MovieBar.appendChild(movieImg)
            MovieBar.appendChild(movieDesc)
            document.getElementById("movieContent").appendChild(MovieBar);
            var els = ['imdb_id', 'belongs_to_collection', 'budget', 'revenue',
                'release_date', 'vote_average', 'vote_count']
            for (const el of els) {
                var p = document.createElement('p');
                p.id = el;
                if (el === 'budget' || el === 'revenue') {
                    movie[el] = convertMoney(parseInt(movie[el]), 0)
                }
                p.innerHTML = el + ': ' + movie[el]
                movieDesc.appendChild(p)
            }
            console.log('collection', movie.belongs_to_collection);

            //createMovieImages(element.className)
            //createMovieCastCrew(element.className)
            //createMovieTorrents(element.className)
            //createMovieTrailer(element.className)
        })
    });
}

function getSC(movie) {
    var google = require('google')
    google.resultsPerPage = 1
    var nextCounter = 0
    var sc = document.createElement('p')
    movieDesc.appendChild(sc)
    console.log(movie.title + ' ' + parseInt(movie.release_date) + 'film senscritique')

    google(movie.title + ' ' + parseInt(movie.release_date) + ' film senscritique', function (err, res) {
        if (err) console.error(err)
        var link = res.links[0];
        var rating = link.rating
        console.log('lol', rating, 'lol');
        //var regex=/Rating: ([0-9.]*)\/10 - ([0-9,]*) votes/
        var regexNote = /Rating: ([0-9.]*)\/10/
        var regexNumber = /([0-9,]*) votes/
        var note = regexNote.exec(rating)[1];
        var number = regexNumber.exec(rating)[1];
        var senscritique = {
            note: note,
            number: number
        }
        console.log(senscritique)
        sc.innerHTML = senscritique.note + ' ' + senscritique.number;

        return senscritique;
    })
}
function createCollection(id) {
    getCollection(id, function (collection) {
        var divCollection = document.createElement('div')
        divCollection.id = 'divCollection'
        var divDescription = document.createElement('div')
        divDescription.id = 'divDescription'
        var divParts = document.createElement('div')
        divParts.id = 'divParts';
        document.body.appendChild(divCollection)
        divCollection.appendChild(divDescription)
        divCollection.appendChild(divParts)
        var h1 = document.createElement('h1')
        h1.innerHTML = collection.name;
        var p = document.createElement('p')
        p.innerHTML = collection.overview;
        var imgCollection = document.createElement('img')
        imgCollection.src = "https://image.tmdb.org/t/p/w500" + collection.poster_path;
        divDescription.appendChild(h1)
        divDescription.appendChild(imgCollection)
        divDescription.appendChild(p)
        var movies = collection.parts;
        movies.sort(function (a, b) {
            a = parseInt(a.release_date)
            b = parseInt(b.release_date)
            return a < b ? -1 : a > b ? 1 : 0;
        });
        for (const movie of movies) {
            var img = document.createElement('img')
            img.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
            divParts.appendChild(img)
            console.log(movies);
        }
    })
}

function createMovieTrailer(id) {
    getMovieTrailer(id, function (videos) {
        var trailer
        for (const video of videos) {
            if (video.type === 'Trailer') {
                trailer = video
            }
        }
        var iframe = document.createElement('iframe')
        iframe.src = 'https://www.youtube.com/embed/' + trailer.key + '?rel=0&amp;showinfo=0&amp;hd=1&amp;iv_load_policy=3'
        iframe.frameBorder = 0;
        iframe.allowFullscreen = true;
        movieContent.appendChild(iframe)
        //<iframe width="560" height="315" src="https://www.youtube.com/embed/Yp257b5APOg?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    })
}

function createMovieTorrents(id) {
    getMovie(id, function (movie) {
        var els = ['title', 'size', 'seeds', 'peers',
            'time', 'link']
        var tableTorrent = document.createElement('table');
        movieContent.appendChild(tableTorrent)
        var trHeaders = document.createElement('tr');
        for (const header of els) {
            var th = document.createElement('th')
            th.innerHTML = header;
            trHeaders.appendChild(th)
        }
        tableTorrent.appendChild(trHeaders);
        const TorrentSearchApi = require('torrent-search-api');
        const torrentSearch = new TorrentSearchApi();
        torrentSearch.enableProvider('YggTorrent', 'ketshi', 'arth1995');
        torrentSearch.search(movie.title + ' ' + parseInt(movie.release_date), 'Movies', 20)
            .catch(err => {
                console.log(err);
            })
            .then(torrents => {
                for (const torrent of torrents) {
                    var trTorrent = document.createElement('tr')
                    for (const el of els) {
                        var td = document.createElement('td');
                        td.id = el;
                        if (el === 'link') {
                            var link = document.createElement('a');
                            link.href = torrent.link
                            link.innerHTML = 'Download';
                            td.appendChild(link);
                        }
                        else {
                            td.innerHTML = torrent[el];
                        }
                        trTorrent.appendChild(td)
                    }
                    tableTorrent.appendChild(trTorrent)
                }
            })
    })
}

function createMovieImages(id) {
    getMovieImages(id, function (data) {
        // for (const poster of data.posters) {
        //     var img=document.createElement('img')
        //     img.src="https://image.tmdb.org/t/p/w500" + poster.file_path
        //     img.width=200;
        //     movieContent.appendChild(img)
        // }
        for (const backdrop of data.backdrops) {
            var img = document.createElement('img')
            img.src = "https://image.tmdb.org/t/p/w500" + backdrop.file_path
            img.width = 400;
            movieContent.appendChild(img)
        }
    })
}

function createMovieCastCrew(id) {
    getMovieCastCrew(id, function (data) {
        var divCast = document.createElement('div')
        divCast.id = 'divCast';
        var divCrew = document.createElement('div')
        divCrew.id = 'divCrew'
        var index = 0;
        var divC
        var name, img
        for (const cast of data.cast) {
            if (index === 10)
                break;
            divC = document.createElement('div')
            divC.id = 'cast'
            img = document.createElement("img");
            if (cast.profile_path === null) {
                img.src = 'no_profile.png'
            }
            else {
                img.src = "https://image.tmdb.org/t/p/w185" + cast.profile_path
            }
            var character = document.createElement('p');
            character.innerHTML = cast.character;
            name = document.createElement('p');
            name.innerHTML = cast.name;
            divC.appendChild(character);
            divC.appendChild(img);
            divC.appendChild(name);
            index++;
            divCast.appendChild(divC)
        }
        var indexCrew = 0;
        for (const crew of data.crew) {
            if (indexCrew === 10)
                break;
            divC = document.createElement('div')
            divC.id = 'crew'
            img = document.createElement("img");
            if (crew.profile_path === null) {
                img.src = 'no_profile.png'
            }
            else {
                img.src = "https://image.tmdb.org/t/p/w185" + crew.profile_path
            }
            var job = document.createElement('p');
            job.innerHTML = crew.job;
            name = document.createElement('p');
            name.innerHTML = crew.name;
            divC.appendChild(job);
            divC.appendChild(img);
            divC.appendChild(name);
            divCrew.appendChild(divC)
            indexCrew++;
        }
        movieContent.appendChild(divCast)
        movieContent.appendChild(divCrew)
    })
}

function convertRuntime(mins) {
    let m = mins % 60;
    let h = (mins - m) / 60
    return h.toString() + ' h ' + (m < 10 ? '0' : '') + m.toString() + ' min'
}

function convertMoney(num, fixed) {
    if (num === null) { return null; } // terminate early
    if (num === 0) { return '0'; } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
}

function minColumn(nbrColumns, callback) {
    var min = 1e9
    var minColumn
    for (let c = 1; c <= nbrColumns; c++) {
        var columnChildren = $(".columnId-" + c.toString()).children().length
        if (min > columnChildren) {
            min = columnChildren
            minColumn = c
        }
    }
    callback(minColumn)
}

function getRequest(url, callback) {
    var results = [];
    var count = 0;
    for (let a = 1; a <= 10; a++) {
        var page = a.toString();
        var options = {
            method: 'GET',
            url: url,
            qs: { page: page, language: 'fr-FR', api_key: API_KEY },
            body: '{}'
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var data = JSON.parse(body);
            results.push(...data.results);
            count++;
            if (count === 10) {
                callback(results)
            }
        })
    }
}