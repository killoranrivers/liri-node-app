require("dotenv").config();
let moment = require("moment");
let axios = require("axios");

let keys = require("./keys.js");
// let spotify = new Spotify(keys.spotify);
let argv = process.argv;
let omdbKey = "91ef9e7d";
let searchTerm = "";

// Scan added arguments in process.argv to grab user input
for (let i = 2; i < argv.length; i++) {
    if (i > 2 && i < argv.length) {
        searchTerm = `${searchTerm}+${argv[i]}`;
    }
    else {
        searchTerm += argv[i];
    };
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

concertThis(searchTerm);

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
