<script setup lang="ts">
import TrackButton from "./TrackButton.vue";
import Icon from "./Icon.vue";

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

</script>

<template>
    <div class="habit-wrapper">
        <Icon :id="HabitProps.icon" :color="HabitProps.color" :size="iconSize"></Icon>
        <div class="habit-info">
            <h3 class="habit-name">{{ HabitProps.name }}</h3>
            <p class="habit-text">{{ HabitProps.interval }}</p>
        </div>
        <TrackButton :id="HabitProps.id" :color="HabitProps.color" :percentage="percentage" :size="iconSize"></TrackButton>
    </div>
</template>

<style scoped>

</style>