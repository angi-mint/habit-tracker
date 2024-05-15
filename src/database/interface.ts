interface Habit {
    id: number;
    name: string;
    icon: number;
    color: number;
    category: string;
    frequency: number;
    interval: number;
    timeperiod: boolean;
    startDate: string;
    endDate: string;
    calendar: boolean,
    startTime: string;
    endTime: string;
    todo: boolean;
    id: number;
}

interface HabitState {
    id: number;
    name: string;
    icon: string;
    color: string;
    frequency: number;
    entries: number;
    interval: number;
    timeperiod: boolean;
    startDate: string;
    endDate: string;
    calendar: boolean,
    startTime: string;
    endTime: string;
    todo: boolean;
}

interface iCalCredentials {
    url: string;
    username: string;
    password: string;
}

export type { Habit, HabitState, iCalCredentials };