<script setup lang="ts">
const currentDate = new Date();
const currentMonth = currentDate.getMonth();

function getMonthString(month: number) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
    return months[month];
}

</script>

<template>
<h2> {{ getMonthString(currentMonth)}}</h2>
</template>

<style scoped>

</style>