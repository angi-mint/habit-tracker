// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';

const API = {

    sendMsg: (msg: any) => ipcRenderer.send("message-test", msg),

    onCount: (callback: any) => ipcRenderer.on("count", (_event: any, args: any) => {
        callback(args);
    }),
    sendPromise: (msg: any) => ipcRenderer.invoke("promise-msg", msg),


    sendHabitName: (args: any) => ipcRenderer.invoke("getNameOfHabit", args),
    sendHabitObject: (Habit: object) => ipcRenderer.invoke("sendHabitObject", Habit),
    getDailyHabits: () => ipcRenderer.invoke("getDailyHabits"),
};

contextBridge.exposeInMainWorld('api', API);