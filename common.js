const xml = require('@xmpp/xml');
module.exports.jabfy = function (message, text) {
    let reply_message = {};
    let to = message.user;
    let type = message.group ? 'groupchat' : 'chat';

    let body = text;
    reply_message.text = body;
    reply_message.stanza = xml`<message to="${to}" type="${type}"><body>${body}</body></message>`;

    return reply_message;
}