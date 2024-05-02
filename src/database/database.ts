import sqlite3 from "sqlite3";
import { Habit } from "./interface";

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
        const params: Array<string | number | boolean> = habit.timeperiod
            ? [
                habit.name,
                habit.frequency,
                habit.interval,
                habit.timeperiod,
                habit.startDate,
                habit.endDate,
                categoryID,
                habit.color,
                habit.icon
            ]
            : [
                habit.name,
                habit.frequency,
                habit.interval,
                habit.timeperiod,
                categoryID,
                habit.color,
                habit.icon
            ];

        const sql: string = habit.timeperiod
            ? `INSERT INTO habit (name, frequency, interval, timeperiod, startDate, endDate, category_id, color_id, icon_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            : `INSERT INTO habit (name, frequency, interval, timeperiod, category_id, color_id, icon_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

export default {
    openDb,
    addHabit,
};