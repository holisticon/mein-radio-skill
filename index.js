'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.50843b7a-5cb1-4288-b387-bc53186440c7';

const tellAlexa = function(song, env) {
  const title = song.title.replace('&ndash;', '-');
  const ssmlTitle = `<prosody rate="slow">${title}</prosody>`;
  env.emit(':tellWithCard', ssmlTitle, "Aktueller Song", title, song.image);

};

const currentSong = function (env) {
  const slotValues = getSlotValues(env.event.request.intent.slots);
  if (slotValues.Station === undefined) {
    const errorResponseMessage = 'Ich habe den Sender nicht verstanden.';
    console.info(errorResponseMessage);
    env.emit(':tell', errorResponseMessage);
  } else if (!slotValues.Station.isValidated) {
    const errorResponseMessage = `Den Sender ${slotValues.Station.synonym} kenne ich noch nicht.`;
    console.info(errorResponseMessage);
    env.emit(':tellWithCard', errorResponseMessage, 'Unbekannter Sender', responseMessage);
  } else {
    const stationKey = slotValues.Station.resolved.toLowerCase();
    console.log(stationKey);
    const stationCartridge = "./cartridges/" + stationKey + ".js";
    const station = require(stationCartridge);
    station(tellAlexa, env);
  }
};

function getSlotValues (filledSlots) {
    //given event.request.intent.slots, a slots values object so you have
    //what synonym the person said - .synonym
    //what that resolved to - .resolved
    //and if it's a word that is in your slot values - .isValidated
    let slotValues = {};

    console.log('The filled slots: ' + JSON.stringify(filledSlots));
    Object.keys(filledSlots).forEach(function(item) {
        //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
        var name = filledSlots[item].name;
        //console.log("name: "+name);
        if(filledSlots[item]&&
           filledSlots[item].resolutions &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case "ER_SUCCESS_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
                        "isValidated": true
                    };
                    break;
                case "ER_SUCCESS_NO_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].value,
                        "isValidated":false
                    };
                    break;
                }
            } else {
                slotValues[name] = {
                    "synonym": filledSlots[item].value,
                    "resolved": filledSlots[item].value,
                    "isValidated": false
                };
            }
        },this);
        //console.log("slot values: "+JSON.stringify(slotValues));
        return slotValues;
}

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
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
