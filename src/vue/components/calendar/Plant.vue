<script setup lang="ts">

import {Habit, HabitData} from "./DailyOverview.vue";
import {onMounted, ref} from "vue";

const data = ref<HabitData>({
    daily: [],
    weekly: [],
    monthly: [],
    done: [],
});

const fetchHabits = async () => {
    data.value = await window.api.getDailyHabits();
};

const calcTotalPercentage = () => {
    let totalEntries = 0;
    let totalFrequency = 0;

    const accumulateEntriesAndFrequency = (habits: Habit[]) => {
        habits.forEach(habit => {
            totalEntries += habit.entries;
            totalFrequency += habit.frequency;
        });
    };

    accumulateEntriesAndFrequency(data.value.daily);
    accumulateEntriesAndFrequency(data.value.weekly);
    accumulateEntriesAndFrequency(data.value.monthly);
    accumulateEntriesAndFrequency(data.value.done);

    return (totalEntries / totalFrequency) * 100;
};

onMounted(async () => {
    await fetchHabits();
});
</script>

<template>
    <div class="plant">
        <h2>Plant</h2>
        <img v-if="calcTotalPercentage() < 21" src="../../../assets/img/1.png">
        <img v-else-if="calcTotalPercentage() < 41" src="../../../assets/img/2.png">
        <img v-else-if="calcTotalPercentage() < 61" src="../../../assets/img/3.png">
        <img v-else-if="calcTotalPercentage() < 81" src="../../../assets/img/4.png">
        <img v-else src="../../../assets/img/5.png">
    </div>
</template>

<style scoped>

</style>