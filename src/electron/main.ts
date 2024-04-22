const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
//database import
import db from '../database/database';


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
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // For TestDatabase.vue
  //---------------------
  let count = 0;
  setInterval(() => {
    mainWindow.webContents.send("count", count++);
  }, 1000);
  //---------------------
};


// For TestDatabase.vue
//---------------------
console.log("über ipcMain wird eine Nachricht empfangen");

ipcMain.on("message-test", (event: any, args: any) => {
  console.log(args);
});

ipcMain.handle("promise-msg", async (event: any, args: any) => {
  console.log(args);

  const cpuUsage = process.cpuUsage();
  console.log(cpuUsage);
  return cpuUsage;
});
//---------------------


// Handle for getting habit name
ipcMain.handle("getNameOfHabit", async (event: any, args: any) => {
  console.log(args.id);
  const habitName = await db.getHabit(args.id);
  return habitName;
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
