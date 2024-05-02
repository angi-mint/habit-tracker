<script setup lang="ts">

import WeeklyTracker from "./WeeklyTracker.vue";

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

// get actual data from database, replace line 21 with line 20
//const weekData = await window.api.getHabits(options.format(weekInfo().firstDayOfWeek), options.format(weekInfo().lastDayOfWeek));
const weekData = [{id: 1, name: "Drink Water", icon: "glass", color: "blue", frequency: 3, interval: "Daily", dates: ["2024-04-29", "2024-04-29", "2024-04-29", "2024-04-30", "2024-04-30", "2024-04-30", "2024-05-01", "2024-05-02", "2024-05-02", "2024-05-03"]}, {id: 2, name: "Go for a walk", icon: "book", color: "blue", frequency: 2, interval: "Daily", dates: ["2024-04-29", "2024-04-29", "2024-04-30", "2024-04-30", "2024-05-01", "2024-05-02", "2024-05-02", "2024-05-03"]},]

</script>

<template>
    <h2>Diese Woche: {{weekInfo().firstDayOfWeek.toLocaleDateString('de-DE', {day: "2-digit", month: "2-digit"})}} - {{weekInfo().lastDayOfWeek.toLocaleDateString('de-DE', {day: "2-digit", month: "2-digit", year: "2-digit"})}}</h2>
    <WeeklyTracker
        v-for="habit in weekData"
        :id="habit.id"
        :name="habit.name"
        :icon="habit.icon"
        :color="habit.color"
        :frequency="habit.frequency"
        :interval="habit.interval"
        :dates="habit.dates"
        :weekInfo="weekInfo()">
    </WeeklyTracker>
</template>

<style scoped>

</style>