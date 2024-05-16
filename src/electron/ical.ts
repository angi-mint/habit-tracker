import db from "../database/database";
import {Habit} from "../database/interface";
import * as ICAL from 'ical.js';

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

async function logData() {
    try {
        const data = await fetchHabits();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching habits:', error);
        return null;
    }
}

function createICalEventString(habit: Habit): string {
    // Create a new VEVENT component
    const vevent = new ICAL.Component('vevent');

    // Set UID, SUMMARY, DESCRIPTION, DTSTART, and DTEND properties
    vevent.addPropertyWithValue('UID', 'HABIT-' + habit.id.toString());
    vevent.addPropertyWithValue('SUMMARY', habit.name);
    vevent.addPropertyWithValue('DESCRIPTION', habit.category || '');
    vevent.addPropertyWithValue('DTSTART', habit.startDate + 'T' + habit.startTime);
    vevent.addPropertyWithValue('DTEND', habit.endDate + 'T' + habit.endTime);
    const frequency = habit.interval === 0 ? 'DAILY' : habit.interval === 1 ? 'WEEKLY' : 'MONTHLY';

    if (habit.timeperiod) {
        const duration = new ICAL.Duration(habit.endDate + 'T' + habit.endTime, habit.startDate + 'T' + habit.startTime);
        const count = Math.ceil(duration.toDays()) / habit.frequency;
        vevent.addPropertyWithValue('RRULE', `FREQ=${frequency};COUNT=${count}`);
    } else {
        vevent.addPropertyWithValue('RRULE', `FREQ=${frequency};INTERVAL=${habit.frequency}`);
    }
    return vevent.toString();
}

export { fetchHabits, logData }