<script setup lang="ts">

import MonthlyTracker from "./MonthlyTracker.vue";
import {onMounted, ref} from "vue";

const currentDate = new Date();

export interface MonthInfo {
    firstDayOfMonth: Date,
    lastDayOfMonth: Date
}

export interface DateInfo {
    year: number,
    month: number,
    daysInMonth: number
}

function dateInfo(month?: number): DateInfo {
    if (!month) month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return {
        year: year,
        month: month,
        daysInMonth: daysInMonth
    };
}

function monthInfo(): MonthInfo {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {firstDayOfMonth: firstDayOfMonth, lastDayOfMonth: lastDayOfMonth};
}
const options = new Intl.DateTimeFormat('sv', {day: "2-digit", month: "2-digit", year: "numeric"});

const reloader = ref(0);

const handleReload = async() => {
    await fetchHabits();
    reloader.value += 1;
};

const monthData = ref<{ id: number; name: string; icon: string; color: string; frequency: number; interval: string; dates: string[]; }[]>([]);

const fetchHabits = async () => {
    monthData.value = await window.api.getWeeklyOrMonthlyHabits(options.format(monthInfo().firstDayOfMonth), options.format(monthInfo().lastDayOfMonth));
};

onMounted(async () => {
    await fetchHabits();
});
</script>

<template>
    <h2> {{ currentDate.toLocaleDateString('de-DE', {month: "long"}) }}</h2>
    <MonthlyTracker
            @reload="handleReload()"
            v-for="habit in monthData"
            :id="habit.id"
            :name="habit.name"
            :icon="habit.icon"
            :color="habit.color"
            :frequency="habit.frequency"
            :interval="(habit.interval === 'Daily') ? 0 : (habit.interval === 'Weekly') ? 1 : 2"
            :dates="habit.dates"
            :dateInfo="dateInfo()"
            :key="reloader">
    </MonthlyTracker>
</template>

<style scoped>

</style>