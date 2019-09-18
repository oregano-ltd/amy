// luis Configuration
module.exports.config = {
    luis: {
        serviceUri: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6e723fa9-6dc2-4630-aeba-dec34e1af75e?staging=true&verbose=true&timezoneOffset=-360&subscription-key=9cf02ece1bc54129a2a18e271fd0ae45'
    },
    nlp: {
        threshold: .90
    }
};