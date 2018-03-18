useStrict();

var API_KEY = 'aa79a25e783821b082e1e241e41889db';

class movieDataBase {

    getCollection(id) {

        var url = 'https://api.themoviedb.org/3/collection/' + id
        var append_to_response = 'images'
        return this.getRequest(url, append_to_response)
    }

    getTV(id) {

        var url = 'https://api.themoviedb.org/3/tv/' + id
        var append_to_response = 'credits,images,videos,recommendations'

        return this.getRequest(url, append_to_response)
    }
    getPeople(id) {

        var url = 'https://api.themoviedb.org/3/people/' + id
        var append_to_response = 'movie_credits,images'

        return this.getRequest(url, append_to_response)

    }
    getMovie(id) {

        var url = 'https://api.themoviedb.org/3/movie/' + id
        var append_to_response = 'credits,images,videos,recommendations'

        return this.getRequest(url, append_to_response)
    }

    getRequest(url, append_to_response, page) {
        var options = {
            method: 'GET',
            url: url,
            qs: {
                language: LANGUAGE, api_key: API_KEY, append_to_response: append_to_response,
                include_image_language: 'en,null', page: page
            },
            body: '{}',
            json: true
        };
        return rp(options)
            .then(function (response) {
                return response
            })
            .catch(function (err) {
                console.log(err);

            });
    }

    getRequests(list,number) {

        var url = 'https://api.themoviedb.org/3/movie/'+list
        var PromiseArray = [];

        for (let i = 1; i <= number; i++) {
            PromiseArray.push(this.getRequest(url, null, i))
        }
        return Promise.all(PromiseArray)
            .then(allResponses => {
                 allResponses =allResponses.map(value => value.results);
                 allResponses = [].concat(...allResponses)
                return allResponses  
            })
    }
}

module.exports = movieDataBase;

function useStrict() {
    'use strict';
}
