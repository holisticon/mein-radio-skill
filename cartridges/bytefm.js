const https = require('https');

const station = function(callback, env) {
    https.get('https://www.byte.fm/ajax/song-history/', function (resp) {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', function (chunk) {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', function () {
            const json = JSON.parse(data);
            console.log(json);
            const song = {
                "title": json.tracks[0],
                "image": {
                    "smallImageUrl": json.artistImageURL,
                    "largeImageUrl": json.artistImageURL
                }
            }
            callback(song, env);
        });

    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}

module.exports = station;