const config = require('./config');
const Twitter = require('./src/services/Twitter');
const GoogleSpreadSheet = require('./src/services/GoogleSpreadSheet');
const utils = require('./src/utils');

console.log(utils.strToHashTags('dog'));
run();

async function run() {
    const client = new Twitter(config.twitter);
    const { statuses: tweets } = await client.search({
        hashTags: utils.strToHashTags('dog')
    });

    const googleClient = new GoogleSpreadSheet(config.google);
    const results = await googleClient.save({
        spreadsheetId: '1hxlTpsTOmDBf_BYMmVyJxxFpowf2NfUsPKGl6pIqE2s',
        data: utils.tweetsToSpreadsheetFormat(tweets)
    });
    console.log(results);
}