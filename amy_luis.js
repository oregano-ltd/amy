import {
    Botkit
} from 'botkit';

import {
    luis as _luis
} from './config.js'

import {
    middleware
} from './luis';

const controller = new Botkit({
    webhook_uri: '/api/messages',
});

const luisOptions = {
    serviceUri: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6e723fa9-6dc2-4630-aeba-dec34e1af75e?staging=true&verbose=true&timezoneOffset=-360&subscription-key=9cf02ece1bc54129a2a18e271fd0ae45'
}

controller.middleware.ingest.use(() => {
    console.log('yes, i got your message')
});

controller.middleware.send.use(() => {
    console.log('yes, message is sent.')
});

controller.middleware.receive.use(middleware.receive(luisOptions));

controller.on('message', async (bot, message) => {
    await bot.reply(message, 'I heard you say something!');
    console.log(message.topIntent)
});