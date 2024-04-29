interface Habit {
    name: string;
    icon: number;
    color: number;
    category: number;
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
}

export type { Habit, HabitState };