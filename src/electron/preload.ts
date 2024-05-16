// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';
import {iCalCredentials} from "@/database/interface";

const API = {
    getColorList: () => ipcRenderer.invoke("getColorList"),
    getCategoryList: () => ipcRenderer.invoke("getCategoryList"),
    sendHabitObject: (Habit: object) => ipcRenderer.invoke("sendHabitObject", Habit),
    reloadHabitObject: (id: number) => ipcRenderer.invoke("reloadHabitObject", id),
    updateHabitObject: (Habit: object) => ipcRenderer.invoke("updateHabitObject", Habit),
    getDailyHabits: () => ipcRenderer.invoke("getDailyHabits"),
    getWeeklyOrMonthlyHabits: (startDate: string, endDate: string) => ipcRenderer.invoke("getWeeklyOrMonthlyHabits", startDate, endDate),
    sendTrackHabit: (id: number) => ipcRenderer.invoke("sendTrackHabit", id),
    saveICalCredentials: (iCalCredentials: object) => ipcRenderer.invoke("saveICalCredentials", iCalCredentials),
};

contextBridge.exposeInMainWorld('api', API);