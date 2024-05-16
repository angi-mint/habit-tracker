<script setup lang="ts">
import HabitBarChart from "./HabitBarChart.vue";

// const habitData = await window.api.invoke
const habitData = [{id: 1, name: "Drink Water", icon: "water", color: "#b43737", frequency: 8, entries: 4, interval: "Daily", dates: ["2024-04-01", "2024-04-02", "2022-04-03", "2024-04-04"]}, {id: 2, name: "Read Book", icon: "book", color: "#bd6060", frequency: 2, entries: 1, interval: "Weekly", dates: ["2024-04-01", "2024-04-01", "2024-04-10", "2022-04-15", "2024-04-22"]},];

const currentDay = new Date();

// Calculate the start date (4 weeks ago from the beginning of the current week)
const startDate = new Date(currentDay);
startDate.setDate(startDate.getDate() - (startDate.getDay() + 20)); // Go back to the beginning of the week 4 weeks ago

// Calculate the end date (last day of the previous week)
const endDate = new Date(currentDay);
endDate.setDate(endDate.getDate() - (endDate.getDay() + 1)); // Go back to the end of the previous week

// Format the dates (optional, for better readability)
const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


</script>

<template>
<HabitBarChart></HabitBarChart>
</template>

<style scoped>

</style>