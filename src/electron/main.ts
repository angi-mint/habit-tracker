import {app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

//database import
import db from '../database/database';
import {Habit, iCalCredentials} from '../database/interface';
import {sync} from "./ical";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        void mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// Handle for getting color list
ipcMain.handle("getColorList", async (_event: any) => {
    return await db.getColorList();
});

// Handle for getting category list
ipcMain.handle("getCategoryList", async (_event: any) => {
  return await db.getCategoryList();
});

// Handle for sending habit object
ipcMain.handle("sendHabitObject", async (_event: any, habit: Habit) => {
    return await db.addHabit(habit);
});

// Handle for updating habit object
ipcMain.handle("updateHabitObject", async (_event: any, habit: Habit) => {
    return await db.updateHabit(habit);
});

// Handle for getting daily habits
ipcMain.handle("getDailyHabits", async (_event: any) => {
    return await db.showDailyHabits();
});

// Handle for addRecord
ipcMain.handle("sendTrackHabit", async (_event: any, id: number) => {
    return await db.addRecord(id);
});

// Handle for saving iCal credentials
ipcMain.handle("saveICalCredentials", async (_: any, creds: iCalCredentials) => {
    return await db.saveICalCredentials(creds);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    console.log(sync().then((data) => {console.log(data.toString())}));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
