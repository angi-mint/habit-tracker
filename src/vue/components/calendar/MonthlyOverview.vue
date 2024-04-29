<script setup lang="ts">

import MonthlyTracker from "./MonthlyTracker.vue";

const currentDate = new Date();
function getMonth(month?: number): Array<string|number>{
    if (!month) month = currentDate.getMonth();

    const monthInfo = [];
    const monthList = ["Januar", "Februar", "März", "April", "Mai", "Juni", "July", "August", "September", "Oktober", "November", "Dezember"];
    const daysInMonth = new Date(currentDate.getFullYear(), month + 1, 0).getDate();

    monthInfo.push(monthList[month], daysInMonth);
    return monthInfo;
}

</script>

<template>
    <h2> {{ getMonth()[0]}}: {{currentDate.toLocaleDateString('sv')}} </h2>
    <MonthlyTracker></MonthlyTracker>
</template>

<style scoped>

</style>