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

export interface Habit {
  name: string;
  icon: number;
  color: number;
  category: number;
  frequency: number;
  interval: number;
  timeperiod: boolean;
  startDate: string;
  endDate: string;
}

function addHabit(habit: Habit): Promise<number> {
  const db = openDb();
  return new Promise((resolve, reject) => {
    let sql = "";
    let params: object = [];

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

//Wochentage bekommen

function getWeekDates(): string[] {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  let diff = currentDay - 1; // 1 represents Monday
  if (diff < 0) diff += 7; // if it's Sunday, diff will be -1, so add 7 to make it 6

  const monday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - diff
  );

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + i
    );
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    weekDates.push(formattedDate);
  }

  return weekDates;
}

interface HabitState {
  id: number;
  name: string;
  icon: string;
  color: string;
  frequency: number;
  entries: number;
  interval: number;
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
                const sql = `SELECT COUNT(*) as count FROM record WHERE habit_id = ? AND date IN (${placeholders})`;
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
            .then(() => resolve({ daily, weekly, monthly, done }))
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