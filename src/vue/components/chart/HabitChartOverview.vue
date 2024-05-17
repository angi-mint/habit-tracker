<script setup lang="ts">
import HabitBarChart from "./HabitBarChart.vue";
import {onMounted, ref} from "vue";

const currentDay = new Date();
const options = new Intl.DateTimeFormat('sv', {day: "2-digit", month: "2-digit", year: "numeric"});


const startDate = new Date(currentDay);
startDate.setDate(startDate.getDate() - (startDate.getDay() + 20));

const endDate = new Date(currentDay);
endDate.setDate(endDate.getDate() - (endDate.getDay() + 1));

const habitData = ref([]);

onMounted(async () => {
    const data = await window.api.getWeeklyOrMonthlyHabits(options.format(startDate), options.format(endDate));
    habitData.value = data;
});
</script>

<template>
<HabitBarChart v-for="habit in habitData" :habit="habit"></HabitBarChart>
</template>

<style scoped>

</style>