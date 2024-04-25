<script setup lang="ts">
import DailyTracker from "./DailyTracker.vue";

// get actual data  from Database later
const data = [
        [{id: 1, name: "Wasser trinken", icon: "heart", color: "#e97a7a", frequency: 5, entries: 3},
            {id: 2, name: "Buch lesen", icon: "pill", color: "#be4848", frequency: 4, entries: 1}],
        [{id: 3, name: "Vitamine nehmen", icon: "book", color: "#be4848", frequency: 10, entries: 0},
            {id: 4, name: "Wasser trinken", icon: "glass", color: "#912929", frequency: 5, entries: 3}],
        [{id: 5, name: "Zimmer aufräumen", icon: "heart", color: "#983f3f", frequency: 5, entries: 2},
            {id: 6, name: "Sport machen", icon: "pill", color: "#d28787", frequency: 4, entries: 2}],
        [{id: 5, name: "Zimmer aufräumen", icon: "heart", color: "#be4848", frequency: 5, entries: 5},
            {id: 6, name: "Sport machen", icon: "pill", color: "#be4848", frequency: 4, entries: 4}]
]

</script>

<template>
    <div class="habits-daily habits-wrapper">
        <h2>Heute</h2>
        <DailyTracker v-for="habit in data[0]" :id="habit.id" :name="habit.name" :icon="habit.icon" :color="habit.color" :frequency="habit.frequency" :entries="habit.entries" :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>

    <div class="habits-weekly habits-wrapper">
        <h2> Diese Woche</h2>
        <DailyTracker v-for="habit in data[1]" :id="habit.id" :name="habit.name" :icon="habit.icon" :color="habit.color" :frequency="habit.frequency" :entries="habit.entries" :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>

    <div class="habits-monthly habits-wrapper">
        <h2> Diesen Monat</h2>
        <DailyTracker v-for="habit in data[2]" :id="habit.id" :name="habit.name" :icon="habit.icon" :color="habit.color" :frequency="habit.frequency" :entries="habit.entries" :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>

    <div class="habits-finished habits-wrapper">
        <h2>Erledigt!</h2>
        <DailyTracker v-for="habit in data[3]" :id="habit.id" :name="habit.name" :icon="habit.icon" :color="habit.color" :frequency="habit.frequency" :entries="habit.entries" :interval="habit.entries + '/' + habit.frequency"></DailyTracker>
    </div>
</template>

<style scoped>

</style>