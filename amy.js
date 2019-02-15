const Botkit = require('Botkit/lib/Botkit.js');
const com = require('./common.js');
const dialog = require('./dialogue.js')
const xml = require('@xmpp/xml');

var controller = Botkit.jabberbot({
    json_file_store: './jabberbot/'
});

var bot = controller.spawn({
    client: {
        jid: 'amy@abc.inc',
        password: '1234',
        host: "10.10.20.17",
        port: 5222
    }
});

function ExtractMentionJids(message) {
    let direct_mention_reg = /href="xmpp:\s?(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)\s?"/ig;
    let email_reg = /\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/i;
    let match = message.stanza.toString().match(direct_mention_reg);
    let mention_jids = [];
    if (match) {
        for (let i = 0; i < match.length; i++) {
            let jid_match = match[i].match(email_reg);
            if (jid_match) {
                let jid = jid_match[0];
                if (jid != bot.client_jid) {
                    mention_jids.push(jid);
                }
            }
        }
    }
    return mention_jids;
}

function toUTCDateTimeString(date) {
    var yyyy = date.getUTCFullYear();
    var mm = date.getUTCMonth() < 9 ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1); // getMonth() is zero-based
    var dd = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
    var hh = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours();
    var min = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes();
    var ss = date.getUTCSeconds() < 10 ? "0" + date.getUTCSeconds() : date.getUTCSeconds();
    return "".concat(yyyy).concat('-').concat(mm).concat('-').concat(dd).concat('T').concat(hh).concat(':').concat(min).concat(':').concat(ss);
};

//Greetings
controller.hears(['hello'], ['direct_mention', 'direct_message', 'message_received'], function (bot, message) {

    bot.startConversation(message, function (err, convo) {

        let reply = com.jabfy(message, dialog.greeting(message));

        convo.say(reply);

    });
});

controller.hears(['how are you*'], ['direct_mention', 'direct_message', 'message_received'], function (bot, message) {

    bot.startConversation(message, function (err, convo) {

        let reply = com.jabfy(message, dialog.hru(message));
        convo.say(reply);
    });
});

controller.hears(['batch status'], ['direct_mention', 'direct_message', 'message_received'], function (bot, message) {

    bot.createConversation(message, function (err, convo) {

        // let reply = com.jabfy(message, 'Sure, have you got the batch id with you?');

        let reply = 'Sure, have you got the batch id with you?';

        convo.addMessage({ text: 'Can i have that?' }, 'said_yes');
        convo.addMessage({ text: 'oh sorry to hear that!' }, 'said_no');

        convo.addQuestion(reply, [{
            pattern: 'yes',
            callback: function (response, convo) {
                convo.gotoThread('said_yes');
            }
        },
        {
            pattern: 'no',
            callback: function (resposne, convo) {
                convo.gotoThread('said_no');
            }
        },
        {
            default: true,
            callback: function (response, convo) {
                convo.gotoThread('bad_response');
            }
        }
        ], {}, 'default');


        convo.activate();

    });
});

controller.on('conversationStarted', function(bot, convo){
    console.log('Conversation started with ', convo.context.user);
});

controller.on('conversationEnded', function (bot, convo) {
    console.log('Conversation stopped with ', convo.context.user);
})