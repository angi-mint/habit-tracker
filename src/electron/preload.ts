// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

const API = {

    sendMsg: (msg: any) => ipcRenderer.send("message-test", msg),

    onCount: (callback: any) => ipcRenderer.on("count", (event: any, args: any) => {
        callback(args);
    }),

    sendPromise: (msg: any) => ipcRenderer.invoke("promise-msg", msg),
    sendHabitName: (args: any) => ipcRenderer.invoke("getNameOfHabit", args),
};

contextBridge.exposeInMainWorld('api', API);