require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');

const keys = require('./keys');

const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
const data = process.argv.slice(3) ;

function callSpotifyApi(song) {
    // TODO: Make sure to load correct song.
    if (!song) song = 'The Sign by Ace of Base';
    spotify
        .search({ type: 'track', query: song })
        .then(response => {
            // console.log('response: ', JSON.stringify(response));
            spotify
                .request(response.tracks.items[0].href)
                .then(data => {
                    // console.log('data: ', JSON.stringify(data));
                    console.log('Album name: ', data.album.name);
                    console.log('Artist name: ', data.artists[0].name);
                    console.log('Song name: ', data.name);
                    console.log('Preview url: ', data.preview_url);
                })
                .catch(err => {
                    console.error('Error occurred: ' + err);
                });
        });
}

function callOmbdApi(movieTitle) {
    if (movieTitle) {
        axios.get(`http://www.omdbapi.com/?apikey=${keys.OMDB.secret}&t=${movieTitle}`)
            .then(response => {
                // console.log('response: ', JSON.stringify(response.data));
                console.log('Movie Title: ', response.data.Title);
                console.log('Year: ', response.data.Year);
                console.log('IMDB rating: ', response.data.imdbRating);
                console.log('Rotten Tomatoes Rating: ', response.data.Ratings[1].Value); // TODO: Search array
                console.log('Country: ', response.data.Country);
                console.log('Language: ', response.data.Language);
                console.log('Movie plot: ', response.data.Plot);
                console.log('Actors: ', response.data.Actors);
            })
            .catch(err => {
                console.log('Error occurred: ', err);
            });
    } else {
        axios.get(`http://www.omdbapi.com/?apikey=${keys.OMDB.secret}&t=Mr. Nobody`)
            .then(response => {
                console.log('Mr. Nobody', response.data);
            });
    }
}

function callBandsInTownApi(bandName) {
    axios.get(`https://rest.bandsintown.com/artists/${bandName}/events?app_id=codingbootcamp`)
        .then(response => {
            // console.log('response: ', JSON.stringify(response.data));
            response.data.forEach(concert => {
                console.log('Venue Name: ', concert.venue.name);
                console.log('Venue Location: ', `${concert.venue.city}, ${concert.venue.country}`);
                console.log('Event Date: ', moment(concert.datetime).format('MM/DD/YYYY'));
            });
        })
        .catch(err => {
            console.log('Error occurred: ' + err);
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        console.log(data);

            var command = data.split(',');
            console.log(command);
            parseInputs(command[0], command[1])
            //not sure what to do with the const action now to finish running the line from random.txt
    });

}

function parseInputs(action, data) {
    if (action === 'spotify-this-song') {
        callSpotifyApi(data);
    } else if (action === 'movie-this') {
        callOmbdApi(data);
    } else if (action === 'concert-this') {
        callBandsInTownApi(data);
    } else if (action === 'do-what-it-says') {
        doWhatItSays();
    } else {
        console.error('Invalid Command');
    }
}
parseInputs(action,data);