const config = require('./config');
const Twitter = require('./src/Twitter');

const client = new Twitter(config);
client.search({
    hashTags: ['dog', 'bone', 'rice']
}).then((res) => {
    console.log('====>', res);
});