import { app } from "electron";
import path from "path";
import log from "electron-log";
import fs from "fs-extra";
import sqlite3 from "sqlite3";
import {Habit, HabitState, HabitWeMo, Record, iCalCredentials} from "./interface";
import { getWeekDates, getMonthDates } from "./utils";

function openDb() {
    const userDataPath = app.getPath("userData");
    const dbFileName = "habitdb.db";
    const unpackedPath = app.isPackaged
        ? path.join(process.resourcesPath, 'app.asar.unpacked', 'database', dbFileName)
        : path.join(__dirname, '../../src/database', dbFileName);
    const dbPath = path.join(userDataPath, dbFileName);

    if (!fs.existsSync(dbPath)) {
        fs.copySync(unpackedPath, dbPath);
    }

    log.info(`Opening database at ${dbPath}`);

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            log.error(`Failed to open database: ${err.message}`);
        } else {
            log.info("Connected to the database.");
        }
    });
    return db;
}

function addRecord(id: number): Promise<void> {
    const db = openDb();
    const date = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO record (habit_id, date) VALUES (?, ?)",
            [id, date],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function getColorList() {
    const db = openDb();
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name FROM color', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getCategoryList() {
    const db = openDb();
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name FROM category', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getOrAddCategory(categoryName: string): Promise<number> {
    const db = openDb();
    return new Promise((resolve, reject) => {
        // First, try to find the category
        db.get('SELECT id FROM category WHERE name = ?', [categoryName], (err, row: {id: number}) => {
            if (err) {
                reject(err);
            } else if (row) {
                // If the category exists, resolve with its id
                resolve(row.id);
            } else {
                // If the category does not exist, add it to the database
                db.run('INSERT INTO category (name) VALUES (?)', [categoryName], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Resolve with the id of the newly inserted category
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
}

async function addHabit(habit: Habit): Promise<number> {
    const db = openDb();
    const categoryID = habit.category === undefined ? 5 : await getOrAddCategory(habit.category);

    return new Promise((resolve, reject) => {
        const params: Array<string | number | boolean | null> = [
            habit.name,
            habit.frequency,
            habit.interval,
            habit.timeperiod,
            (habit.timeperiod) ? habit.startDate : null,
            (habit.timeperiod) ? habit.endDate : null,
            habit.calendar,
            (habit.calendar) ? habit.startTime : null,
            (habit.calendar) ? habit.endTime : null,
            habit.todo,
            categoryID,
            habit.color,
            habit.icon
        ];

        const sql: string = `INSERT INTO habit (name, frequency, interval, timeperiod, startDate, endDate, calendar, startTime, endTime, todo, category_id, color_id, icon_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

//Tägliche Habits anzeigen
async function showDailyHabits() {
    const db = openDb();
    return new Promise<{
        daily: HabitState[];
        weekly: HabitState[];
        monthly: HabitState[];
        done: HabitState[];
    }>((resolve, reject) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;

        const weekDates = getWeekDates();

        db.all(
            "SELECT habit.id, habit.name, icon.name as icon, color.name as color, category.name as category, habit.frequency, habit.interval, habit.timeperiod, habit.startDate, habit.endDate, habit.calendar, habit.startTime, habit.endTime, habit.todo FROM habit JOIN icon ON habit.icon_id = icon.id JOIN color ON habit.color_id = color.id JOIN category ON category.id = habit.category_id",
            (err, habits: HabitState[]) => {
                if (err) {
                    reject(err);
                } else {
                    const daily: HabitState[] = [];
                    const weekly: HabitState[] = [];
                    const monthly: HabitState[] = [];
                    const done: HabitState[] = [];

                    const promises = habits.map((HabitState) => {
                        return new Promise<void>((resolve, reject) => {
                            if (HabitState.interval === 1) {
                                // Check if interval = 1 (daily)
                                db.get(
                                    "SELECT COUNT(*) as count FROM record WHERE habit_id = ? AND date = ?",
                                    [HabitState.id, formattedDate],
                                    (err, row: {count: number}) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            HabitState.entries = row.count;
                                            if (HabitState.frequency === row.count) {
                                                // Check if frequency = entries
                                                done.push(HabitState);
                                            } else {
                                                daily.push(HabitState);
                                            }
                                            resolve();
                                        }
                                    }
                                );
                            } else if (HabitState.interval === 2) {
                                // Check if interval = 2 (weekly)

                                const placeholders = weekDates.map(() => "?").join(", ");
                                const sql = `SELECT COUNT(*) as count
                                             FROM record
                                             WHERE habit_id = ? AND date IN (${placeholders})`;
                                db.get(sql, [HabitState.id, ...weekDates], (err, row: {count: number}) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        HabitState.entries = row.count;
                                        if (HabitState.frequency === row.count) {
                                            // Check if frequency = entries
                                            done.push(HabitState);
                                        } else {
                                            weekly.push(HabitState);
                                        }
                                        resolve();
                                    }
                                });
                            } else if (HabitState.interval === 3) {
                                // Check if interval = 3 (monthly)

                                const currentMonth = new Date().getMonth() + 1; // Months are zero-based
                                const currentYear = new Date().getFullYear();

                                db.get(
                                    'SELECT COUNT(*) as count FROM record WHERE habit_id = ? AND strftime("%m", date) = ? AND strftime("%Y", date) = ?',
                                    [HabitState.id, currentMonth, currentYear],
                                    (err, row: {count: number}) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            HabitState.entries = row.count;
                                            if (HabitState.frequency === row.count) {
                                                // Check if frequency = entries
                                                done.push(HabitState);
                                            } else {
                                                monthly.push(HabitState);
                                            }
                                            resolve();
                                        }
                                    }
                                );
                            } else {
                                resolve();
                            }
                        });
                    });

                    Promise.all(promises)
                        .then(() => resolve({daily, weekly, monthly, done}))
                        .catch(reject);
                }
            }
        );
    });
}

async function getWeeklyOrMonthlyHabits(startDate: string, endDate: string): Promise<HabitWeMo[]> {
    const db = openDb();

    return new Promise<HabitWeMo[]>((resolve, reject) => {
        db.all(`SELECT habit.id, habit.name, icon.name as icon, color.name as color, category.name as category, habit.frequency, habit.interval, habit.timeperiod, habit.startDate, habit.endDate, habit.calendar, habit.startTime, habit.endTime, habit.todo FROM habit JOIN icon ON habit.icon_id = icon.id JOIN color ON habit.color_id = color.id JOIN category ON category.id = habit.category_id`, [], (err: Error, habits: HabitWeMo[]) => {
            if (err) {
                reject(err);
            } else {
                const promises = habits.map((habit: HabitWeMo) => new Promise<HabitWeMo>((resolve, reject) => {
                    db.all(`SELECT date FROM record WHERE habit_id = ? AND date BETWEEN ? AND ?`, [habit.id, startDate, endDate], (err: Error, records: Record[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            habit.dates = records.map((record: Record) => record.date);
                            resolve(habit);
                        }
                    });
                }));

                Promise.all(promises)
                    .then(habits => resolve(habits))
                    .catch(err => reject(err));
            }
        });
    });
}

async function saveICalCredentials(cred: iCalCredentials) {
    const db = openDb();
    // check if there already is an entry with id 1, if yes update else create a new entry
    return new Promise<void>((resolve, reject) => {
        db.get('SELECT id FROM ical WHERE id = 1', (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                db.run('UPDATE ical SET url = ?, username = ?, password = ? WHERE id = 1', [cred.url, cred.username, cred.password], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                db.run("INSERT INTO ical (id, url, username, password) VALUES (1, ?, ?, ?)", [cred.url, cred.username, cred.password], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

async function getICalCredentials(): Promise<iCalCredentials> {
    const db = openDb();
    return new Promise((resolve, reject) => {
        db.get('SELECT url, username, password FROM ical WHERE id = 1', (err, row: iCalCredentials) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

export default {
    openDb,
    addRecord,
    getColorList,
    getCategoryList,
    addHabit,
    showDailyHabits,
    getWeeklyOrMonthlyHabits,
    saveICalCredentials, 
    getICalCredentials
};
