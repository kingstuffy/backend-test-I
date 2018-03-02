const inquirer = require('inquirer');
const config = require('./config');
const Twitter = require('./services/Twitter');
const GoogleSpreadSheet = require('./services/GoogleSpreadSheet');
const utils = require('./utils');

inquirer.prompt([
    {
        type: 'input',
        name: 'hashTags',
        message: 'Please enter your hash tags separated by comma or space. eg: #dogs, rice: ',
        validate(value) {
            return value ? true : 'Please enter a valid hash tag';
        },
    },
    {
        type: 'input',
        name: 'count',
        message: `Please enter number of tweets; Default is ${config.defaultNumberOfTweets}: `,
    },
    {
        type: 'input',
        name: 'spreadsheetId',
        message: 'Please enter your spreadsheet id: ',
        validate(value) {
            return value ? true : 'Please enter a valid spreadsheet ID';
        },
    },
]).then(answers => {
    // 1hxlTpsTOmDBf_BYMmVyJxxFpowf2NfUsPKGl6pIqE2s
    run(answers);
});

async function run({ hashTags, spreadsheetId, count = config.defaultNumberOfTweets }) {
    const client = new Twitter(config.twitter);
    const twitterHashTags = utils.strToHashTags(hashTags);
    const prettyTwitterHashTag = twitterHashTags.join(', ');

    console.info(`############ Fetching tweets for ${prettyTwitterHashTag}`);

    const { statuses: tweets } = await client.search({
        hashTags: twitterHashTags,
        count
    });

    if (tweets.length === 0) {
        console.error(`############ Couldn't find any tweets for ${prettyTwitterHashTag}`);
        return;
    }

    console.info(`############ Fetched ${tweets.length} tweets for ${prettyTwitterHashTag}`);


    console.info(`############ Saving user data to spreadsheet ${spreadsheetId}`);
    const googleClient = new GoogleSpreadSheet(config.google);
    const results = await googleClient.save({
        spreadsheetId,
        data: utils.tweetsToSpreadsheetFormat(tweets)
    });
    console.info(`############ Saved ${results.updatedRows - 1} users to spreadsheet ${spreadsheetId}`);
}