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

export interface Habit {
  name: string,
  icon?: number,
  color?: number,
  category?: number,
  frequency: number,
  interval: number,
  timeperiod: boolean,
  startDate: string,
  endDate: string
}

function addHabit(habit: Habit): Promise<number> {
  const db = openDb();
  return new Promise((resolve, reject) => {

    let sql = '';
    let params: object = [];

    if (habit.timeperiod === true) {
      sql = 'INSERT INTO habit (name, icon, color, category, frequency, interval, timeperiod, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      params = [habit.name, habit.icon, habit.color, habit.category, habit.frequency, habit.interval, habit.timeperiod, habit.startDate, habit.endDate];
    }
    else {
      sql = 'INSERT INTO habit (name, icon, color, category, frequency, interval, timeperiod) VALUES (?, ?, ?, ?, ?, ?, ?)';
      params = [habit.name, habit.icon, habit.color, habit.category, habit.frequency, habit.interval, habit.timeperiod];
    }

    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    })
  });
}



export default {
  getHabit,
  addHabit,
};