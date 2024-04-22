import sqlite3 from 'sqlite3';


function openDb() {
  const db = new sqlite3.Database('./src/database/habitdb.db', (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  return db;
}

function getHabit(id: number): Promise<string | null> {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.get('SELECT name FROM habit WHERE id = ?', id, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.name : null);
      }
    });
  });
}

export default {
  getHabit,
};