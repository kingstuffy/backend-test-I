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

    /**
     * Saves the given data to the google spreadsheet
     * @param spreadsheetId
     * @param data
     * @returns {Promise<void>}
     */
    async save({ spreadsheetId, data }) {
        const authClient = await this.googleAuth.authorize(this.config);
        const saveStatus = await this.saveToExcel({ authClient, spreadsheetId, data });
        return saveStatus;
    }


    /**
     * Saves the given data to the google spreadsheet
     * @param authClient
     * @param spreadsheetId
     * @param data
     * @returns {Promise<void>}
     */
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

        return Promise.promisify(sheets.spreadsheets.values.update)(request);
    }


    /**
     * Clears the excel sheet data between Sheet1!A1:Z1000
     * @param authClient
     * @param spreadsheetId
     */
    clearSheet({ authClient, spreadsheetId }) {
        const request = {
            spreadsheetId,
            range: 'Sheet1!A1:Z1000',
            auth: authClient,
        };

        return Promise.promisify(sheets.spreadsheets.values.clear)(request);
    }


    /**
     * Gets the range required in the sheet for the given data
     * @param data {Array<{Array}>}
     * @returns {string}
     */
    getRange(data) {
        const firstRow = data[0];
        const endAlphabet = this.getRangeAlphabet(firstRow.length);
        return `Sheet1!A1:${endAlphabet}${data.length}`;
    }

    /**
     * Gets the equivalent alphabet for an index. Eg: 1 -> A, 4 -> D
     * @param index
     * @returns {*}
     */
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