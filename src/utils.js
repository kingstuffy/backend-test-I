const _ = require('lodash');

/**
 * Coverts strings to an array of hash tags
 * @param input {String}
 * @returns {string[]}
 */
function strToHashTags(input = '') {
    const spaceSeparatedInput = input.split(' ');
    const commaSeparatedInput = spaceSeparatedInput
        .map((input) => input.split(','));
    const flattenedInput = _.flatten(commaSeparatedInput);
    const filledInput = flattenedInput.filter((input) => input !== '');
    const uniqueInput = _.uniq(filledInput);
    return uniqueInput.map((input) => (
        input.startsWith('#') ? input : `#${input}`
    ));
}

/**
 * Converts twitter tweets to google spreadsheet compatible data
 * @param tweets {Array<Object>}
 * @returns {*[]}
 */
function tweetsToSpreadsheetFormat(tweets) {
    const userData = tweets.map((tweet) => [
        tweet.user.screen_name,
        tweet.user.name,
        tweet.user.followers_count,
    ]);
    const uniqueUserData = _.uniqBy(userData, (user) => user[0]);
    const spreadsheetData = [
        ['Username', 'Name', 'Number Of Followers'],
        ...uniqueUserData,
    ];

    return spreadsheetData;
}

module.exports = {
    strToHashTags,
    tweetsToSpreadsheetFormat,
};
