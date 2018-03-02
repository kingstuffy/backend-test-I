const Promise = require('bluebird');
const google = require('googleapis');
const sheets = google.sheets('v4');
const GoogleAuth = require('./GoogleAuth');

class GoogleSpreadSheet {

    constructor(config) {
        this.config = config;
        this.googleAuth = new GoogleAuth(config);
        this.saveToExcel = this.saveToExcel.bind(this);
    }

    async save({ spreadsheetId, data }) {
        const authClient = await this.googleAuth.authorize(this.config);
        const saveStatus = await this.saveToExcel({ authClient, spreadsheetId, data });
        return saveStatus;
    }

    async saveToExcel({ authClient, spreadsheetId, data }) {

        await this.clearSheet({ authClient, spreadsheetId });

        const request = {
            spreadsheetId,
            valueInputOption: 'USER_ENTERED',
            range: this.getRange(data),
            resource: {
                majorDimension: "ROWS",
                values: data,
            },
            auth: authClient,
        };

        return new Promise((resolve, reject) => {
            Promise.promisify(sheets.spreadsheets.values.update)(request, function (err, response) {
                if (err) {
                    return reject(err);
                }
                return resolve(response);
            });
        });
    }

    clearSheet({ authClient, spreadsheetId }) {
        const request = {
            spreadsheetId,
            range: 'Sheet1!A1:Z1000',
            auth: authClient,
        };

        return Promise.promisify(sheets.spreadsheets.values.clear)(request);
    }


    getRange(data) {
        const firstRow = data[0];
        const endAlphabet = this.getRangeAlphabet(firstRow.length);
        return `Sheet1!A1:${endAlphabet}${data.length}`;
    }

    getRangeAlphabet(index) {
        const letters = {};
        let letter_first = 'A';
        let letter_last = 'Z';
        let currentIndex = 1;
        for (let letter = letter_first.charCodeAt(0); letter <= letter_last.charCodeAt(0); letter++) {
            letters[currentIndex] = String.fromCharCode(letter);
            currentIndex++;
        }
        return letters[index];
    }
}

module.exports = GoogleSpreadSheet;