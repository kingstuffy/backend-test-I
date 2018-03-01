const TwitterLib = require('twitter');
const Promise = require('bluebird');

class Twitter {

    constructor(config) {
        const client = new TwitterLib(config.twitter);
        this.client = Promise.promisifyAll(client);
    }

    search({ hashTags, count = 50 }) {
        const q = this.formatHashTags(hashTags);
        const params = {
            q,
            count,
        };
        return this.client.get('search/tweets', params);
    }

    formatHashTags(hashTags) {
        return hashTags.map((hashTag) => encodeURIComponent(hashTag)).join(', ');
    }


}

module.exports = Twitter;