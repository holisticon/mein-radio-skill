const http = require('http');

const station = function (callback, env) {
    http.get('http://www.ndr.de/public/radio_playlists/ndr2.json', function (result) {
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            const json = JSON.parse(chunk);
            console.log(json);
            const song = {
                "title": json.song_now,
                "image": {
                    smallImageUrl: 'https://www.ndr.de/public/radio_playlists/coverimages/' + json.song_now_cover + '_300x300.jpg',
                    largeImageUrl: 'https://www.ndr.de/public/radio_playlists/coverimages/' + json.song_now_cover + '_600x600.jpg'
                }
            }
            callback(song, env);
        });
    }).on('error', function (err) {
        console.log('Error: ' + err.message);
    });
}
