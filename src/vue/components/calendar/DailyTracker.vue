<script setup lang="ts">
import TrackButton from "./TrackButton.vue";
import Icon from "./Icon.vue";
import { ref, computed } from "vue";

const HabitProps = defineProps({
    id: Number,
    name: String,
    icon: String,
    color: String,
    frequency: Number,
    entries: Number,
    interval: String,
});
const percentage = (HabitProps.entries! / HabitProps.frequency!) * 100;

const iconSize = 40;

const reloader = ref(0);

const emit = defineEmits(['reload']);

const handleHabitTracked = (id) => {
    reloader.value += 1;
    emit('reload');
};

</script>

<template>
    <div class="habit-wrapper" :key="reloader">
        <Icon :id="HabitProps.icon" :color="HabitProps.color" :size="iconSize"></Icon>
        <div class="habit-info">
            <h3 class="habit-name">{{ HabitProps.name }}</h3>
            <p class="habit-text">{{ HabitProps.interval }}</p>
        </div>
        <TrackButton @reload="handleHabitTracked(HabitProps.id)" :id="HabitProps.id" :color="HabitProps.color" :percentage="percentage" :disabled="percentage === 100" :size="iconSize" :key="reloader"></TrackButton>
    </div>
</template>

<style scoped>

</style>