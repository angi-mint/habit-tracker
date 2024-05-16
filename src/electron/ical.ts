import db from "../database/database";
// @ts-ignore
import * as ICAL from 'ical.js';
import { processHabits } from "./icalComponent";

async function connectToICal() {
    const { net } = require('electron');
    const creds = await db.getICalCredentials();
    if (!creds) return;

    const request = net.request(creds.url);
    request.setHeader('Authorization', 'Basic ' + Buffer.from(creds.username + ':' + creds.password).toString('base64'));
    return request;
}

async function fetchHabits(): Promise<any> {
    const request = await connectToICal();
    if (!request) return;

    return new Promise((resolve, reject) => {
        let data = '';

        request.on('response', (response) => {
            console.log(`STATUS: ${response.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

            response.on('data', (chunk: Buffer) => {
                data += chunk.toString();
            });

            response.on('end', () => {
                try {
                    const ical = ICAL.parse(data);
                    resolve(ical);
                } catch (error) {
                    reject(error);
                }
            });
        });
        request.end();
    });
}

// return synced ical data
async function sync() {
    try {
        const habits = await db.getAllHabits();
        if (!habits) return;

        const data = await fetchHabits();
        const ical = !data ? new ICAL.Component(['vcalendar', [], []]) : new ICAL.Component(data);

        // Process habits and update the calendar
        processHabits(ical, habits);

        return ical;
    } catch (error) {
        return console.error('Error syncing habits:', error);
    }
}