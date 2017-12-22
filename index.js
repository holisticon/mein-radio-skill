'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const APP_ID = 'amzn1.ask.skill.50843b7a-5cb1-4288-b387-bc53186440c7';  // TODO replace with your app ID (OPTIONAL).

const currentSong = (emit) => {
  https.get('https://www.byte.fm/ajax/song-history/', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data).current_show_title);
      const title = JSON.parse(data).tracks[0].replace('&ndash;', '-');
      const ssmlTitle = `<prosody rate="slow">${title}</prosody>`;
      const image = {
        "smallImageUrl": JSON.parse(data).artistImageURL,
        "largeImageUrl": JSON.parse(data).artistImageURL
      };
      emit(':tellWithCard', ssmlTitle, "Aktueller Song", title, image);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};

const handlers = {
  'AMAZON.StopIntent': () => {
    this.emit(':tell', 'OK');
  },
  'AMAZON.CancelIntent': () => {
    this.emit(':tell', 'OK');
  },
  'AMAZON.HelpIntent': () => {
    this.emit(':tell', 'Frag mich nach dem aktuellen Titel');
  },
  'CurrentSongIntent': () =>{
    currentSong(this.emit);
  }
};


exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
