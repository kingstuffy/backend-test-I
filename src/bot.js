const inquirer = require('inquirer');
const config = require('./config');
const utils = require('./utils');
const GoogleSpreadSheet = require('./services/GoogleSpreadSheet');
const Logger = require('./services/Logger');
const Twitter = require('./services/Twitter');

const logger = new Logger({ logger: console.log });

bot();

function bot() {

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
        return run(answers);
    }).then(() => {
        bot();
    }).catch((err) => {
        logger.error(err);
        bot();
    });

}


async function run({ hashTags, spreadsheetId, count = config.defaultNumberOfTweets }) {
    const client = new Twitter(config.twitter);
    const twitterHashTags = utils.strToHashTags(hashTags);
    const prettyTwitterHashTag = twitterHashTags.join(', ');

    logger.progress(`############ Fetching tweets for ${prettyTwitterHashTag}`);

    const { statuses: tweets } = await client.search({
        hashTags: twitterHashTags,
        count
    });

    if (tweets.length === 0) {
        logger.error(`############ Couldn't find any tweets for ${prettyTwitterHashTag}`);
        return;
    }

    logger.progress(`############ Fetched ${tweets.length} tweets for ${prettyTwitterHashTag}`);


    logger.progress(`############ Saving user data to spreadsheet ${spreadsheetId}`);
    const googleClient = new GoogleSpreadSheet(config.google);
    const results = await googleClient.save({
        spreadsheetId,
        data: utils.tweetsToSpreadsheetFormat(tweets)
    });
    logger.success(`############ Saved ${results.updatedRows - 1} users to spreadsheet ${spreadsheetId}`);

}