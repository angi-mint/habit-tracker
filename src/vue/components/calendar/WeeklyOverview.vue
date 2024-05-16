<script setup lang="ts">

import WeeklyTracker from "./WeeklyTracker.vue";
import {onMounted, ref} from "vue";

export interface WeekInfo {
    firstDayOfWeek: Date,
    lastDayOfWeek: Date
}

function weekInfo(): WeekInfo {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    return {firstDayOfWeek: firstDayOfWeek, lastDayOfWeek: lastDayOfWeek};
}

const options = new Intl.DateTimeFormat('sv', {day: "2-digit", month: "2-digit", year: "numeric"});

const reloader = ref(0);

const handleReload = async() => {
    await fetchHabits();
    reloader.value += 1;
};
// const weekData = [{id: 1, name: "Drink Water", icon: "glass", color: "#983f3f", frequency: 3, interval: "Daily", dates: ["2024-04-29", "2024-04-29", "2024-04-29", "2024-04-30", "2024-04-30", "2024-04-30", "2024-05-01", "2024-05-02", "2024-05-02", "2024-05-03"]}, {id: 2, name: "Go for a walk", icon: "book", color: "#cc6464", frequency: 2, interval: "Daily", dates: ["2024-04-29", "2024-04-29", "2024-04-30", "2024-04-30", "2024-05-01", "2024-05-02", "2024-05-02", "2024-05-03"]},]
const weekData = ref<{ id: number; name: string; icon: string; color: string; frequency: number; interval: string; dates: string[]; }[]>([]);

// get actual data from database
const fetchHabits = async () => {
    weekData.value = await window.api.getWeeklyOrMonthlyHabits(options.format(weekInfo().firstDayOfWeek), options.format(weekInfo().lastDayOfWeek));
};

onMounted(async () => {
    await fetchHabits();
});
</script>

<template>
    <h2>Diese Woche: {{weekInfo().firstDayOfWeek.toLocaleDateString('de-DE', {day: "2-digit", month: "2-digit"})}} - {{weekInfo().lastDayOfWeek.toLocaleDateString('de-DE', {day: "2-digit", month: "2-digit", year: "2-digit"})}}</h2>
    <WeeklyTracker
        @reload="handleReload()"
        v-for="habit in weekData"
        :id="habit.id"
        :name="habit.name"
        :icon="habit.icon"
        :color="habit.color"
        :frequency="habit.frequency"
        :interval="(habit.interval === 'Daily') ? 0 : (habit.interval === 'Weekly') ? 1 : 2"
        :dates="habit.dates"
        :weekInfo="weekInfo()"
        :key="reloader">
    </WeeklyTracker>
</template>

<style scoped>

</style>