'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.50843b7a-5cb1-4288-b387-bc53186440c7';

const tellAlexa = function(song, env) {
  const title = song.title.replace('&ndash;', '-');
  const ssmlTitle = `<prosody rate="slow">${title}</prosody>`;
  env.emit(':tellWithCard', ssmlTitle, "Aktueller Song", title, song.image);

};

const currentSong = function (env) {
  const key = env.event.request.intent.slots.Station.value.trim().replace(/ /g, '').replace(/\./g, '').toLowerCase();
  console.log(key);
  const stationCartridge = "./cartridges/" + key + ".js";
  try {
    const station = require(stationCartridge);
    station(tellAlexa, env);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      // Re-throw not "Module not found" errors
      throw e;
    }
    if (e.message.indexOf(stationCartridge) === -1) {
      // Re-throw not found errors for other modules
      throw e;
    }
    const responseMessage = `Den Sender ${key} kenne ich noch nicht.`;
    console.log(responseMessage);
    env.emit(':tellWithCard',  responseMessage, 'Sender unbekannt', responseMessage);
  }
};

const handlers = {
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'OK');
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'OK');
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':tell', 'Frag mich nach dem aktuellen Titel');
  },
  'CurrentSongIntent': function () {
    currentSong(this);
  }
};


exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
