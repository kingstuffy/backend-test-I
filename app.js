const config = require('./config');
const Twitter = require('./src/Twitter');
const utils = require('./src/utils');

console.log(utils.strToHashTags('dog'));

const client = new Twitter(config);
client.search({
    hashTags: utils.strToHashTags('dog')
}).then((res) => {
    console.log('====>', res);
});