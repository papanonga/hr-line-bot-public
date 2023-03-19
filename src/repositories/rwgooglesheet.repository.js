const {google} = require('googleapis')
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const googleSheets = google.sheets({version:"v4", auth: auth})
const spreadsheetId = process.env.SPREAD_SHEET_ID

exports.writeClockIOhistory = async data => await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    valueInputOption: "USER_ENTERED",
    range: data.range,
    insertDataOption: "INSERT_ROWS",
    resource: {
        values: data.data    }
})