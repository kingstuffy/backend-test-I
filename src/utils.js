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
    const uniqueInput =  _.uniq(filledInput);
    return uniqueInput.map((input) => `#${input}`)
}

module.exports = {
    strToHashTags
};
