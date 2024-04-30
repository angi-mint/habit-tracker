<script setup lang="ts">

const HabitTrack = defineProps({
    id: Number,
    color: String,
    percentage: Number,
    size: Number
});

const size = HabitTrack.size + "px";


async function trackHabit() {
    //await window.api.sendTrackHabit(HabitTrack.id);
}

</script>

<template>
    <div @click="trackHabit">
        <svg v-if="HabitTrack.percentage !== 100 && HabitTrack.percentage !== 0" :width="HabitTrack.size" :height="HabitTrack.size" viewBox="0 0 36 36" class="tracker-progress">
            <path class="tracker-circle" :stroke-dasharray="`${HabitTrack.percentage}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        </svg>
        <svg v-else-if="HabitTrack.percentage === 100" class="tracker-svg" xmlns="http://www.w3.org/2000/svg" :width="HabitTrack.size" :height="HabitTrack.size" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        <svg v-else class="tracker-svg tracker-progress" xmlns="http://www.w3.org/2000/svg" :width="HabitTrack.size" :height="HabitTrack.size" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        </svg>
    </div>
</template>

<style scoped>

.tracker-progress {
    cursor: pointer;
}

.tracker-circle {
    stroke: v-bind('HabitTrack.color');
}
.tracker-svg {
    color: v-bind('HabitTrack.color');
}
</style>