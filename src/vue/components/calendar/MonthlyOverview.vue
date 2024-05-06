<script setup lang="ts">

import MonthlyTracker from "./MonthlyTracker.vue";

const currentDate = new Date();

// database function: function(date: string, id: month/week)
const exampleData = [{id: 1, name: "Drink Water", icon: "water", color: "#b43737", frequency: 8, entries: 4, interval: "Daily", dates: ["2024-04-01", "2024-04-02", "2022-04-03", "2024-04-04"]}, {id: 2, name: "Read Book", icon: "book", color: "#bd6060", frequency: 2, entries: 1, interval: "Weekly", dates: ["2024-04-01", "2024-04-01", "2024-04-10", "2022-04-15", "2024-04-22"]},];

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

</script>

<template>
    <h2> {{ currentDate.toLocaleDateString('de-DE', {month: "long"}) }}</h2>
    <MonthlyTracker
            v-for="habit in exampleData"
            :id="habit.id"
            :name="habit.name"
            :icon="habit.icon"
            :color="habit.color"
            :frequency="habit.frequency"
            :interval="habit.interval"
            :dates="habit.dates"
            :dateInfo="dateInfo()">
    </MonthlyTracker>
</template>

<style scoped>

</style>