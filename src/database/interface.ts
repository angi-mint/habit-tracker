interface Habit {
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
}

interface HabitWeMo {
    id: number;
    name: string;
    icon: number;
    color: string;
    frequency: number;
    interval: string;
    dates: string[];
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

interface Record {
    date: string;
}

interface iCalCredentials {
    url: string;
    username: string;
    password: string;
}

export type { Habit, HabitState, HabitWeMo, Record, iCalCredentials };