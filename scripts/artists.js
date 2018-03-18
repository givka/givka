// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function () {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }
// readTextFile("meta/artists.json", function (text) {

//     var h1 = document.createElement("h1");
//     h1.innerHTML = "Artists";
//     h1.id = "title";

//     var divArtists = document.createElement("div");
//     divArtists.id = "artists";
//     document.getElementById("content").appendChild(h1);
//     document.getElementById("content").appendChild(divArtists);

//     // document.getElementsByTagName('body')[0].appendChild(divArtists)
//     // document.getElementsByTagName("body")[0].appendChild(h1)

//     var data = JSON.parse(text);

//     // data.sort(function (a, b) {

//     //     a = a.url.split("-").pop()
//     //     b = b.url.split("-").pop()

//     //     return a < b ? -1 : a > b ? 1 : 0;
//     // });

//     var i = 1
//     var div = document.createElement("div");
//     div.id = "row"
//     var src = document.getElementById("artists");
//     src.appendChild(div)

//     var count = Object.keys(data).length;
//     count = 120;

//     src = document.getElementById("row");
//     var lol = 0

//     var imgError = false
//     var nbrColumns = 5;

//     for (let i = 0; i < nbrColumns; i++) {

//         var div = document.createElement("div");
//         div.id = "column"

//         for (let index = 0; index < count / nbrColumns; index++) {

//             var number = index + Math.floor(i * count / nbrColumns)

//             if (data[number]["wikipediaUrl"] == "")
//                 continue;

//             var divLocal = document.createElement("div");
//             divLocal.id = number
//             divLocal.className = "container"

//             var divName = document.createElement("div");
//             divName.innerHTML = number + ": " + data[number]["artistName"]
//             divName.className = "bottom"

//             var a = document.createElement("a");
//             a.innerHTML = number + ": " + data[number]["artistName"]
//             //a.href = data[number]["wikipediaUrl"]

//             //a.target="SeeWikipedia"

//             var img = document.createElement("img");
//             img.onerror = function (e) {
//                 imgError = true;

//             };

//             img.src = data[number]["image"];
//             img.id = number;

//             if (data[number]["image"] == "http://cdnc.wikiart.org/zur/Global/Images/Global/FRAME-600x480.jpg") {
//                 continue;

//             }

//             if (imgError) {

//                 imgError = false;

//                 continue;

//             }

//             //a.appendChild(img)
//             //a.appendChild(p)

//             divLocal.appendChild(img)
//             divLocal.appendChild(divName)
//             div.appendChild(divLocal)

//         }
//         src.appendChild(div)

//     }

// })

// document.querySelector('#content').addEventListener('click', function (event) {

//     const x = event.target

//     $("#artists").children().remove();
//     $("#title").remove();

//     readTextFile("artists.json", function (text) {
//         var data = JSON.parse(text);
//         // data.sort(function (a, b) {

//         //     a = a.url.split("-").pop()
//         //     b = b.url.split("-").pop()

//         //     return a < b ? -1 : a > b ? 1 : 0;
//         // });

//         var number = parseInt(x.id)

//         var url = data[number]["url"];

//         var divArtist = document.createElement("div")
//         divArtist.id = "artistBar"

//         //divArtist.style.background="url("+data[number].image+")"
//         var bg = "url(" + data[number].image + ")"

//         var str = "content: \'\'; background: " + bg + " fixed 0 0; background-position: 50% 30%; background-size: cover; position: absolute; height: 50vh; top: 0; bottom:0; left: 0; right: 0; z-index: -1; padding: 0;";

//         document.styleSheets[0].addRule('#artistBar:before', str);

//         // var img=document.createElement("img")
//         // img.src=data[number].image
//         // divArtist.appendChild(img)

//         var divBlur = document.createElement("div");
//         divBlur.className = "blur"

//         var artistName = document.createElement("h1");
//         artistName.innerHTML = data[number]["artistName"];
//         divBlur.appendChild(artistName)

//         var date = document.createElement("p")
//         date.innerHTML = data[number]["birthDayAsString"] + " - " + data[number]["deathDayAsString"]
//         divBlur.appendChild(date)

//         divArtist.appendChild(divBlur);

//         document.getElementById("artists").appendChild(divArtist)

//         var json = "meta/" + url + ".json"
//         readTextFile(json, function (text) {

//             var artist = JSON.parse(text);

//             var i = 1

//             var div = document.createElement("div");
//             div.id = "row"
//             var src = document.getElementById("artists");

//             src.appendChild(div)

//             var count = Object.keys(artist).length;
//             src = document.getElementById("row");
//             var lol = 0

//             var imgError = false

//             for (let i = 0; i < 5; i++) {

//                 var div = document.createElement("div");
//                 div.id = "column"

//                 for (let index = 0; index < count / 5; index++) {

//                     var number = index + Math.floor(i * count / 5)

//                     var divLocal = document.createElement("div");
//                     divLocal.id = number

//                     var p = document.createElement("p");
//                     p.innerHTML = artist[number]["artistName"]

//                     var divName = document.createElement("div");
//                     //divName.innerHTML = artist[number]["title"]
//                     divName.className = "bottom"

//                     var a = document.createElement("a");
//                     //a.innerHTML = number + ": " + artist[number]["artistName"]

//                     //a.href = data[number]["wikipediaUrl"]

//                     //a.target="SeeWikipedia"

//                     var img = document.createElement("img");

//                     img.onerror = function () {
//                         this.style.display = "none";

//                     }

//                     img.src = artist[number]["image"];

//                     if (artist[number]["image"] == "http://cdnc.wikiart.org/zur/Global/Images/Global/FRAME-600x480.jpg") {
//                         continue;

//                     }

//                     if (imgError) {

//                         imgError = false;

//                         continue;

//                     }

//                     //a.appendChild(img)
//                     //a.appendChild(p)

//                     divLocal.appendChild(img)
//                     divLocal.appendChild(divName)
//                     div.appendChild(divLocal)

//                 }
//                 src.appendChild(div)

//             }

//         })

//     });

// });
// document.querySelector('#navigation').addEventListener('click', function (event) {

//     const x = event.target
//     if (x.id === "art") {

//         artists();

//     }
//     if (x.id === "movie") {

//         movie();

//     }
// });
