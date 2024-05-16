<script setup lang="ts">
import HabitBarChart from "./HabitBarChart.vue";

const currentDay = new Date();
const options = new Intl.DateTimeFormat('sv', {day: "2-digit", month: "2-digit", year: "numeric"});


const startDate = new Date(currentDay);
startDate.setDate(startDate.getDate() - (startDate.getDay() + 20));

const endDate = new Date(currentDay);
endDate.setDate(endDate.getDate() - (endDate.getDay() + 1));

const habitData = await window.api.getWeeklyOrMonthlyHabits(options.format(startDate), options.format(endDate));

</script>

<template>
<HabitBarChart></HabitBarChart>
</template>

<style scoped>

</style>