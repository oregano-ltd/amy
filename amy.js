'use strict';

// so what do you require?
const {
    Botkit
} = require('botkit');

const {
    config
} = require('./config.js');

const {
    luis
} = require('./luis');

const controller = new Botkit({
    webhook_uri: '/api/messages',
});

const luisOptions = {
    serviceUri: config.luis.serviceUri
}

// ok, let's see what you need

const threshold = config.nlp.threshold;

// controller.middleware.ingest.use(() => {
//     console.log('yes, i got your message')
// });

// controller.middleware.send.use(() => {
//     console.log('yes, message is sent.')
// });

controller.middleware.receive.use(luis.middleware.receive(luisOptions));

controller.on('message', async (bot, message) => {

    let reply = 'sorry, did not understand your request.';

    if (message.topIntent) {
        console.log(message.topIntent);
        const intent = message.topIntent.intent;
        const score = message.topIntent.score;

        if (intent == 'greeting' && score >= threshold)
            reply = 'hello'
        if (intent == 'whois' && score >= threshold) {
            var person = message.entities[0].entity;
            // console.log(message.entities);
            reply = person + ' is our manager.';
        }
        if (intent == 'weather' && score >= threshold) {
            reply = 'it is cloudy today.';
        }

        if (intent == 'hru' && score >= threshold) {
            reply = 'I am great, how about you?';
        }
    }
    await bot.say(reply);
});