import sqlite3 from "sqlite3";
import {Habit, HabitState} from "./interface";
import {getWeekDates} from "./utils";

function openDb() {
    const db = new sqlite3.Database("./src/database/habitdb.db", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Connected to the database.");
        }
    });
    return db;
}

function getHabit(id: number): Promise<string | null> {
    const db = openDb();
    return new Promise((resolve, reject) => {
        db.get("SELECT name FROM habit WHERE id = ?", id, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? row.name : null);
            }
        });
    });
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

function addHabit(habit: Habit): Promise<number> {
    const db = openDb();
    return new Promise((resolve, reject) => {
        let sql: string;
        let params: Array<string | number | boolean>;
        if (habit.timeperiod) {
            sql =
                "INSERT INTO habit (name, icon_id, color_id, category_id, frequency, interval, timeperiod, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            params = [
                habit.name,
                habit.icon,
                habit.color,
                habit.category,
                habit.frequency,
                habit.interval,
                habit.timeperiod,
                habit.startDate,
                habit.endDate,
            ];
        } else {
            sql =
                "INSERT INTO habit (name, icon_id, color_id, category_id, interval, timeperiod) VALUES (?, ?, ?, ?, ?, ?, ?)";
            params = [
                habit.name,
                habit.icon,
                habit.color,
                habit.category,
                habit.frequency,
                habit.interval,
                habit.timeperiod,
            ];
        }

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
            "SELECT habit.id, habit.name, icon.name as icon, color.name as color, habit.frequency, habit.interval FROM habit JOIN icon ON habit.icon_id = icon.id JOIN color ON habit.color_id = color.id",
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
                                    (err, row) => {
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
                                db.get(sql, [HabitState.id, ...weekDates], (err, row) => {
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
                                    (err, row) => {
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

export default {
    getHabit,
    addHabit,
    showDailyHabits,
    getWeekDates,
    addRecord,
    getCategoryList,
};