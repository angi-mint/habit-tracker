<script setup lang="ts">
function getMonth(month?: number): Array<string|number>{
    if (!month) month = new Date().getMonth();

    const monthInfo = [];
    const monthList = ["Januar", "Februar", "März", "April", "Mai", "Juni", "July", "August", "September", "Oktober", "November", "Dezember"];
    const daysInMonth = new Date(currentDate.getFullYear(), month + 1, 0).getDate();

    monthInfo.push(monthList[month], daysInMonth);
    return monthInfo;
}

</script>

<template>
    <h2> {{ getMonth()[0]}} </h2>
</template>

<style scoped>

</style>