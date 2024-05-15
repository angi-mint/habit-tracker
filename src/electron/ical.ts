import db from "../database/database";
import {Habit} from "../database/interface";
import {ICalCalendar, ICalEventRepeatingFreq} from "ical-generator";

async function connectToICal() {
    const { net } = require('electron');
    const creds = await db.getICalCredentials();
    if (!creds) return;

    const request = net.request(creds.url);
    request.setHeader('Authorization', 'Basic ' + Buffer.from(creds.username + ':' + creds.password).toString('base64'));
    return request;
}

async function fetchHabits() {
    const request = await connectToICal();
    if (!request) return;

    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`)
        });
    });
    request.end()
}

async function createCalendarEntry(cal: ICalCalendar, habit: Habit) {
    const event = cal.createEvent({
        start: new Date(habit.startDate),
        end: new Date(habit.endDate),
        summary: habit.name,
        description: habit.category,
    });
    event.repeating({
        freq: habit.interval === 0 ? ICalEventRepeatingFreq.DAILY : habit.interval === 1 ? ICalEventRepeatingFreq.WEEKLY : ICalEventRepeatingFreq.MONTHLY,
        count: habit.frequency
    });
    event.x('X-HABIT-ID', habit.id.toString());
    console.log(event);
}

export { fetchHabits }