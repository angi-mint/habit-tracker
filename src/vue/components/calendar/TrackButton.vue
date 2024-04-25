<script setup lang="ts">

const HabitTrack = defineProps({
    id: Number,
    name: String,
    color: String,
    frequency: Number,
    entries: Number
});

const percentage = (HabitTrack.entries! / HabitTrack.frequency!) * 100;

async function trackHabit() {
    //await window.api.sendTrackHabit(HabitTrack.id);
}

</script>

<template>
    <div @click="trackHabit">
        <svg v-if="percentage !== 100 && percentage !== 0" viewBox="0 0 36 36" class="tracker-progress">
            <path class="tracker-circle" :stroke-dasharray="`${percentage}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        </svg>
        <svg v-else-if="percentage === 100" class="tracker-svg" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        <svg v-else class="tracker-svg" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        </svg>
    </div>
</template>

<style scoped>
.tracker-circle {
    stroke: v-bind('HabitTrack.color');
}
.tracker-svg {
    color: v-bind('HabitTrack.color');
}

</style>