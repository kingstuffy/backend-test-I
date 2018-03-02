const chalk = require('chalk');

class Logger {

    constructor({ logger }) {
        this.logger = logger;
    }

    progress(log) {
        this.logger(chalk.yellow(log));
    }

    success(log) {
        this.logger(chalk.green(log));
    }

    error(log) {
        this.logger(chalk.red(log));
    }
}

module.exports = Logger;
