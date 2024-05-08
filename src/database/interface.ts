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
}

interface iCalCredentials {
    url: string;
    username: string;
    password: string;
}

export type { Habit, HabitState, iCalCredentials };