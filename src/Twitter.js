const TwitterLib = require('twitter');
const Promise = require('bluebird');

class Twitter {

    constructor(config) {
        const client = new TwitterLib(config);
        this.client = Promise.promisifyAll(client);
    }

    /**
     * Searches twitter using the provided hash tag
     * @param hashTags Array oh hash tags
     * @param count
     */
    search({ hashTags, count = 50 }) {
        const q = this.formatHashTags(hashTags);
        const params = {
            q,
            count,
        };
        return this.client.get('search/tweets', params);
    }

    /**
     * Encodes and joins provideed hash tags
     * @param hashTags
     * @returns {string}
     */
    formatHashTags(hashTags) {
        return hashTags.map((hashTag) => encodeURIComponent(hashTag)).join(', ');
    }


}

module.exports = Twitter;
