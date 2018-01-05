const https = require('https');

const station = function(callback, env) {
    https.get('https://www.ndr.de/public/radioplaylists/ndr2.json', function (resp) {
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
                "title": json.song_now,
                "image": {
                    "smallImageUrl": 'https://www.ndr.de/public/radio_playlists/coverimages/' + json.song_now_cover + '_300x300.jpg',
                    "largeImageUrl": 'https://www.ndr.de/public/radio_playlists/coverimages/' + json.song_now_cover + '_600x600.jpg'
                }
            }
            callback(song, env);
        });

    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}

module.exports = station;