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

    if (habit.timeperiod) {
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

//Wochentage bekommen

function getWeekDates(): string[] {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  let diff = currentDay - 1; // 1 represents Monday
  if (diff < 0) diff += 7; // if it's Sunday, diff will be -1, so add 7 to make it 6

  const monday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - diff);

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    weekDates.push(formattedDate);
  }

  return weekDates;
}


export default {
  getHabit,
  addHabit,
  showDailyHabits,
  getWeekDates,
};



/*
//Schleife die habits durchgeht und in einem string mit zwei listen zurück gibt
function showDailyHabitss {
 
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
  const day = ("0" + date.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);

  // erstes Habit aus tabelle habit holen

/*
  if () { //prüfen ob interval = 1 (täglich) ist 

    if () { //prüfen ob frequency = entries ist

      //Habit in ersten Liste speichern

    }else if () { //prüfen ob frequency > entries ist

      //Habit in zweiten Liste speichern

    }



  }else if () { //prüfen ob interval = 2 (wöchentlich) ist 

    //Datums der woche generieren

    //Einträge anhand der Datums aus der tabelle record holen

    if () { //prüfen ob frequency = entries ist

      //Habit in ersten Liste speichern

    }else if () { //prüfen ob frequency > entries ist

      //Habit in zweiten Liste speichern

    }

  }else if () { //prüfen ob interval = 3 (monatlich) ist

    //Monat aus datum holen

    //Einträge anhand des Monats aus der tabelle record holen

    if () { //prüfen ob frequency = entries ist

      //Habit in ersten Liste speichern
    
    }else if () { //prüfen ob frequency > entries ist
    
      //Habit in zweiten Liste speichern
    
    }

  }
}

*/

interface HabitState {
  id: number;
  name: string;
  icon: string;      // muss noch
  color: string;     // geändert werden
  frequency: number;
  entries: number;
  interval: number;
  iconName: string;  // muss noch 
  colorName: string; // geändert werden
}


async function showDailyHabits() {
  const db = openDb();
  return new Promise<{ list1: HabitState[], list2: HabitState[] }>((resolve, reject) => {

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;

    db.all('SELECT habit.*, icon.name as iconName, color.name as colorName FROM habit JOIN icon ON habit.icon_id = icon.id JOIN color ON habit.color_id = color.id', (err, habits: HabitState[]) => {
      if (err) {
        reject(err);
      } else {
        const list1: HabitState[] = [];
        const list2: HabitState[] = [];

        const promises = habits.map((HabitState) => {
          return new Promise<void>((resolve, reject) => {
            if (HabitState.interval === 1) { // Check if interval = 1 (daily)
              db.get('SELECT COUNT(*) as count FROM records WHERE habit_id = ? AND date = ?', [HabitState.id, formattedDate], (err, row) => {
                if (err) {
                  reject(err);
                } else {
                  HabitState.entries = row.count;
                  if (HabitState.frequency === row.count) { // Check if frequency = entries
                    list1.push(HabitState);
                  } else {
                    list2.push(HabitState);
                  }
                  resolve();
                }
              });
            } else {
              resolve();
            }
          });
        });

        Promise.all(promises)
          .then(() => resolve({ list1, list2 }))
          .catch(reject);
      }
    });
  });
}


async function showWeeklyHabits(): Promise<HabitState[][]> {
  const db = openDb();
  const currentDate = new Date();
  const weekHabits: HabitState[][] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;

    const habits = await new Promise<HabitState[]>((resolve, reject) => {
      db.all('SELECT habit.*, icon.name as iconName, color.name as colorName FROM habit JOIN icon ON habit.icon_id = icon.id JOIN color ON habit.color_id = color.id', (err, habits: HabitState[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(habits);
        }
      });
    });

    const dailyHabits: HabitState[] = [];

    for (const habit of habits) {
      if (habit.interval === 1) {
        const row = await new Promise<{ count: number }>((resolve, reject) => {
          db.get('SELECT COUNT(*) as count FROM records WHERE habit_id = ? AND date = ?', [habit.id, formattedDate], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        if (habit.frequency === row.count) {
          habit.entries = row.count;
          dailyHabits.push(habit);
        }
      }
    }

    weekHabits.push(dailyHabits);
  }

  return weekHabits;
}



async function showMonthlyHabits(): Promise<HabitState[][]> {
  const db = openDb();
  const currentDate = new Date();
  const monthHabits: HabitState[][] = [];

  // Hilfsfunktion zur Formatierung des Datums im Format "YYYY-MM-DD"
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Anzahl der Tage im aktuellen Monat

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const formattedDate = formatDate(date);

    const habits = await new Promise<HabitState[]>((resolve, reject) => {
      db.all('SELECT habit.*, icon.name as iconName, color.name as colorName FROM habit JOIN icon ON habit.icon_id = icon.id JOIN color ON habit.color_id = color.id', (err, habits: HabitState[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(habits);
        }
      });
    });

    const dailyHabits: HabitState[] = [];

    for (const habit of habits) {
      if (habit.interval === 1) {
        const row = await new Promise<{ count: number }>((resolve, reject) => {
          db.get('SELECT COUNT(*) as count FROM records WHERE habit_id = ? AND date = ?', [habit.id, formattedDate], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        if (habit.frequency === row.count) {
          habit.entries = row.count;
          dailyHabits.push(habit);
        }
      }
    }

    monthHabits.push(dailyHabits);
  }

  return monthHabits;
}



