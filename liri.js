require("dotenv").config();
let moment = require("moment");
let axios = require("axios");
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let fs = require("fs");
let argv = process.argv;
let omdbKey = "91ef9e7d";
let searchTerm = "";
let command = argv[2];

// Scan added arguments in process.argv to grab user input
for (let i = 3; i < argv.length; i++) {
    if (i > 3 && i < argv.length) {
        searchTerm = `${searchTerm}+${argv[i]}`;
    }
    else {
        searchTerm += argv[i];
    };
};

// Function that uses Node Spotify package to look up song info
function spotifyThis(searchTerm) {
    if (!searchTerm) {
        searchTerm = "The Sign Ace of Base";
        console.log("Since you couldn't pick a song, I went ahead and chose this little earworm...");
    }
    spotify.search({type: "track",  query: searchTerm, limit: 1})
    .then(function(response) {
        //console.log(JSON.stringify(response, null, 2)); 
        console.log(`Artist: ${response.tracks.items[0].artists[0].name}`);
        console.log(`Song Title: ${response.tracks.items[0].name}`);
        if (response.tracks.items[0].preview_url === undefined || response.tracks.items[0].preview_url === null) {
            console.log("Preview: None available");
        }
        else { 
        console.log(`Preview: ${response.tracks.items[0].preview_url}`);
        };
        console.log(`Album: ${response.tracks.items[0].album.name}`);
    })
    .catch(function(err) {
        console.log(err);
    });
};

// Function that uses Axios to search BandsInTown
function concertThis(searchTerm) {
    axios.get(`https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`)
        .then(function (response) {
            if (response.data[0] === undefined) {
                console.log(`${searchTerm} has no upcoming shows :(`);
            }
            else {
                let formattedDate = moment(response.data[0].datetime).format("MMMM Do YYYY");

                console.log(`Artist: ${response.data[0].lineup[0]}`);
                console.log(`Venue: ${response.data[0].venue.name}`);
                console.log(`Location: ${response.data[0].venue.city}, ${response.data[0].venue.region}, ${response.data[0].venue.country}`);
                console.log(`Date: ${formattedDate}`);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

// Function that uses Axios to search OMDB
function movieThis(searchTerm) {
    if (!searchTerm) {
        searchTerm = "Mr.+Nobody";
        console.log(`If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
It's on Netflix!`);

    }
    axios.get(`http://www.omdbapi.com/?t=${searchTerm}&y=&plot=short&apikey=${omdbKey}`)
        .then(function (response) {
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes Score: ${response.data.Ratings[1].Value}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
        })
        .catch(function (error) {
            console.log(error);
        });
};

// Switch statement that runs a specific function based on which command is entered
switch (command) {
    case "concert-this":
        concertThis(searchTerm);
        break;
    case "spotify-this-song":
        spotifyThis(searchTerm);
        break;
    case "movie-this":
        movieThis(searchTerm);
        break;
    case "do-what-it-says":
            
}
