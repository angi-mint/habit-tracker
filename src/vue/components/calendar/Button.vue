<script setup lang="ts">

const HabitTrack = defineProps({
    id: Number,
    name: String,
    color: String,
    frequency: Number,
    entries: Number
});

async function trackHabit() {
    //await window.api.sendTrackHabit(HabitTrack.id);
    console.log(HabitTrack.id)
}

</script>

<template>
    <button @click="trackHabit" class="btn-tracker">
    </button>
</template>

<style scoped>
button {
    background-color: v-bind('HabitTrack.color');
}
</style>