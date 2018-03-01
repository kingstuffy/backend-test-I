const config = require('./config');
const Twitter = require('./src/Twitter');
const GoogleSpreadSheet = require('./src/GoogleSpreadSheet');
const utils = require('./src/utils');

console.log(utils.strToHashTags('dog'));

const client = new Twitter(config.twitter);
client.search({
    hashTags: utils.strToHashTags('dog')
}).then((res) => {
    // console.log('====>', res);
});

const googleClient = new GoogleSpreadSheet(config.google);
googleClient.init();