//Setup for keys
require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
var random = ("./random.txt");

var command = process.argv[2];
var userSearch = process.argv[3];


//SPOTIFY CALL

switch (command) {

    case 'spotify-this-song':
        spotCall(userSearch);
        break;

    case 'movie-this':
        movieTime();
        break;

    case 'my-tweets':
        twit();
        break;

    case 'do-what-it-says':
        says();
        break;

    default:
        console.log("Not a command!");
        break;
}

//SPOTIFY FUNCTION AND RESPONSE
function spotCall(userSearch) {
    var songName = userSearch;

    spotify.search({
        type: 'track',
        query: userSearch
    }, function(err, data) {
        if (err) {
            console.log(err);
            return;
        } else {
            var spotifyInfo = "Artist: " + data.tracks.items[0].artists[0].name +
                "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "Album: " +
                data.tracks.items[0].album.name + "\n" + "Listen on Spotify: " +
                data.tracks.items[0].artists[0].external_urls.spotify;
            console.log(spotifyInfo);

            fs.appendFile('log.txt', spotifyInfo, function(error) {})

        }

    });
}

//OMDB FUNCTION AND RESPONSE
function movieTime() {
    if (userSearch === undefined) {
        userSearch = "mr nobody";
        console.log(userSearch);
    }
    request('http://www.omdbapi.com/?t=' + userSearch + '&y=&plot=short&apikey=trilogy', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieData = JSON.parse(response.body);
            console.log("Title: ", movieData.Title);
            console.log("Year Released: ", movieData.Released);
            console.log("IMDB Rating: ", movieData.imdbRating);
            console.log("Rotten Tomatoes rating: ", movieData.Ratings[1].Value);
            console.log("Country: ", movieData.Country);
            console.log("Language: ", movieData.Language);
            console.log("The plot is", movieData.Plot);
            console.log("Actors: ", movieData.Actors);

            fs.appendFile('log.txt', movieData, function(error) {})

        } else {
            console.log(error);
        }

    });
}

//TWITTER FUNCTION AND RESPONSE
function twit() {
    var params = {
        screen_name: 'johnsm007'
    }
    var tweetNum = 0;
    console.log("-----TWITTER------")
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(function(tweet) {
                tweetNum++;
                console.log("\n  ", tweetNum, "The Tweet: ", tweet.text);
                //console.log("The Tweet: ", tweet.text);
                console.log("     Date/Time: ", tweet.user.created_at);
                console.log("");
            })
        }
    });
}

//DO WHAT IT SAYS FUNCTION AND RESPONSE
function says() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        var arr = data.split(',')

        if (arr.length == 2){
            pick(arr[0], arr[1]);
        }else if (arr.length == 1){
            pick(arr[0]);
        }
        
    });
}

var pick = function(dataOne, dataTwo){
    switch(dataOne) {
        case 'spotify-this-song':
            spotCall(dataTwo);
            break;
            
        case 'movie-this':
            movieTime();
            break;

        case 'my-tweets':
            twit();
            break;

        case 'do-what-it-says':
            says();
            break;

        default:
            console.log("Not a command!");
            break;
            
    }
}

