<script setup lang="ts">
import {onMounted, ref} from "vue";
import DailyTracker from "./DailyTracker.vue";

export interface Habit {
    id: number;
    name: string;
    icon: string;
    color: string;
    category: string;
    frequency: number;
    entries: number;
    interval: number;
    timeperiod: boolean;
    startDate: string;
    endDate: string;
}

interface HabitData {
    daily: Habit[];
    weekly: Habit[];
    monthly: Habit[];
    done: Habit[];
}

const data = ref<HabitData>({
    daily: [],
    weekly: [],
    monthly: [],
    done: [],
});

const fetchDailyHabits = async () => {
    data.value = await window.api.getDailyHabits();
    console.log(data.value);
};

onMounted(async () => {
    await fetchDailyHabits();
    console.log(data.value);
});

</script>

<template>
    <div class="habits-daily habits-wrapper">
        <h2>Heute</h2>
        <DailyTracker v-for="habit in data.daily" :habit="habit"
                      :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>

    <div class="habits-weekly habits-wrapper">
        <h2>Diese Woche</h2>
        <DailyTracker v-for="habit in data.weekly" :id="habit.id" :name="habit.name" :icon="habit.icon"
                      :color="habit.color" :frequency="habit.frequency" :entries="habit.entries"
                      :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>

    <div class="habits-monthly habits-wrapper">
        <h2>Diesen Monat</h2>
        <DailyTracker v-for="habit in data.monthly" :id="habit.id" :name="habit.name" :icon="habit.icon"
                      :color="habit.color" :frequency="habit.frequency" :entries="habit.entries"
                      :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>

    <div class="habits-finished habits-wrapper">
        <h2>Erledigt!</h2>
        <DailyTracker v-for="habit in data.done" :id="habit.id" :name="habit.name" :icon="habit.icon"
                      :color="habit.color" :frequency="habit.frequency" :entries="habit.entries"
                      :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>
</template>

<style scoped>

</style>