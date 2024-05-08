<script setup lang="ts">
import TrackButton from "./TrackButton.vue";
import Icon from "./Icon.vue";
import CreateHabit from "../CreateHabit.vue";
import {PropType} from "vue";
import {Habit} from "./DailyOverview.vue";
import { ref } from "vue";

const HabitProps = defineProps({
    habit: Object as PropType<Habit>,
    interval: String,
});

const percentage = (HabitProps.habit.entries! / HabitProps.habit.frequency!) * 100;

const iconSize = 40;

const reloader = ref(0);

const emit = defineEmits(['reload']);

const handleHabitTracked = (id) => {
    reloader.value += 1;
    emit('reload');
};

</script>

<template>
    <div class="habit-wrapper">
        <Icon :id="HabitProps.habit!.icon" :color="HabitProps.habit!.color" :size="iconSize"></Icon>
        <CreateHabit :fixed="false" :id="HabitProps.habit!.id" :habit-data="HabitProps.habit">
            <template #title>Habit Editieren</template>
            <template #btn-content>
                <div class="habit-info">
                    <h3 class="habit-name">{{ HabitProps.habit.name }}</h3>
                    <p class="habit-text">{{ HabitProps.habit.interval }}</p>
                </div>
            </template>
        </CreateHabit>
        <TrackButton :id="HabitProps.habit!.id" :color="HabitProps.habit!.color" :percentage="percentage" :size="iconSize" :disabled="percentage === 100"></TrackButton>
    <div class="habit-wrapper" :key="reloader">
        <Icon :id="HabitProps.habit!.icon" :color="HabitProps.habit!.color" :size="iconSize"></Icon>
        <CreateHabit :fixed="false" :id="HabitProps.habit!.id" :habit-data="HabitProps.habit">
            <template #title>Habit Editieren</template>
            <template #btn-content>
                <div class="habit-info">
                    <h3 class="habit-name">{{ HabitProps.habit.name }}</h3>
                    <p class="habit-text">{{ HabitProps.habit.interval }}</p>
                </div>
            </template>
        </CreateHabit>
        <TrackButton @reload="handleHabitTracked(HabitProps.id)" :id="HabitProps.habit!.id" :color="HabitProps.habit!.color" :percentage="percentage" :size="iconSize" :disabled="percentage === 100" :key="reloader"></TrackButton>
    </div>
</template>

<style scoped>

</style>