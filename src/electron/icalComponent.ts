import {Habit} from "../database/interface";
// @ts-ignore
import * as ICAL from 'ical.js';
function processHabits(ical: ICAL.Component, habits: Array<Habit>) {
    const existingTodos = ical.getAllSubcomponents('vtodo').map((comp: ICAL.component) => comp.getFirstPropertyValue('uid'));
    const existingEvents = ical.getAllSubcomponents('vevent').map((comp: ICAL.component) => comp.getFirstPropertyValue('uid'));

    habits.forEach((habit) => {
        const habitUid = 'HABIT-' + habit.id.toString();
        if (habit.todo) {
            if (existingTodos.includes(habitUid)) {
                const existingTodo = ical.getSubcomponent(habitUid);
                const newTodo = createICalTodo(habit);
                if (existingTodo !== newTodo) {
                    ical.removeSubcomponent(existingTodo);
                    ical.addSubcomponent(newTodo);
                }
            } else {
                const newTodo = createICalTodo(habit);
                ical.addSubcomponent(newTodo);
            }
        } else if (habit.calendar) {
            if (existingEvents.includes(habitUid)) {
                const existingEvent = ical.getSubcomponent(habitUid);
                const newEvent = createICalEvent(habit);
                if (existingEvent !== newEvent) {
                    ical.removeSubcomponent(existingEvent);
                    ical.addSubcomponent(newEvent);
                }
            } else {
                const newEvent = createICalEvent(habit);
                ical.addSubcomponent(newEvent);
            }
        }
    });
}

function createICalEvent(habit: Habit) {
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
    return vevent;
}

function createICalTodo(habit: Habit) {
    // Create a new VTODO component
    const vtodo = new ICAL.Component('vtodo');

    // Set UID, SUMMARY, DESCRIPTION, DTSTART, and DUE properties
    vtodo.addPropertyWithValue('UID', habit.id.toString());
    vtodo.addPropertyWithValue('SUMMARY', habit.name);
    vtodo.addPropertyWithValue('DESCRIPTION', habit.category || ''); // Use category if available

    // Adjust dueDate based on habit's frequency
    if (habit.timeperiod) {
        // If time period is true, set DUE to the end of the habit's end date
        const dueDate = new Date(habit.endDate + 'T23:59:59');
        vtodo.addPropertyWithValue('DUE', ICAL.Time.fromJSDate(dueDate).toString());
    } else {
        // For other cases, set DUE to the end of the day
        const dueDate = new Date(habit.startDate + 'T23:59:59');
        vtodo.addPropertyWithValue('DUE', ICAL.Time.fromJSDate(dueDate).toString());
    }

    return vtodo;
}

export { processHabits }