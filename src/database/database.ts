import sqlite3 from "sqlite3";

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

export default {
    openDb,
};