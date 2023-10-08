import { readFile, writeFile } from 'fs';
import { createInterface } from 'readline';
import { google } from 'googleapis';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
const WRITE_FILE = 'log.txt';
readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const interval = setInterval(function () {
        authorize(JSON.parse(content), listEvents);
    }, 10000)
});

var event = {
    'summary': 'App Event ' + new Date(2020, 2, 1),
    'location': 'Bangalore',
    'description': 'Meeting/Conference Room Booking',
    'start': {
        'dateTime': new Date(2020, 2, 1, 11, 17, 35),
        'timeZone': 'Asia/Kolkata',
    },
    'end': {
        'dateTime': new Date(2020, 2, 1, 13, 12, 37),
        'timeZone': 'Asia/Kolkata',
    },
    'reminders': {
        'useDefault': false,
        'overrides': [
            { 'method': 'email', 'minutes': 24 * 60 },
            { 'method': 'popup', 'minutes': 10 },
        ],
    },
};
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            writeFile(TOKEN_PATH, JSON.stringify(token, null, "\t"), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
function listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log('res inside the listEvents', res.data.items);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
                writeFile(WRITE_FILE, JSON.stringify(res.data.items, null, "\t"), (err) => {
                    if (err) return console.error(err);
                });
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}
function addEvents(auth) {
    var calendar = google.calendar('v3');
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event.data.summary);
        writeFile(WRITE_FILE, JSON.stringify(event, null, "\t"), (err) => {
            if (err) return console.error(err);
        });
    });
}
