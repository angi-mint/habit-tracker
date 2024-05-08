// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';

const API = {
    getColorList: () => ipcRenderer.invoke("getColorList"),
    getCategoryList: () => ipcRenderer.invoke("getCategoryList"),
    sendHabitObject: (Habit: object) => ipcRenderer.invoke("sendHabitObject", Habit),
    getDailyHabits: () => ipcRenderer.invoke("getDailyHabits"),
    sendTrackHabit: (id: number) => ipcRenderer.invoke("sendTrackHabit", id),
    saveICalCredentials: (url: string, username: string, password: string) => ipcRenderer.invoke("saveICalCredentials", url, username, password),
};

contextBridge.exposeInMainWorld('api', API);