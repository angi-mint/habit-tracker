<script setup lang="ts">
import HabitIcon from "../icons/HabitIcon.vue";

const IconState = defineProps({
    id: String,
    color: String,
    size: Number
});

</script>

<template>
    <HabitIcon :id="IconState.id!" :color="IconState.color" :size="IconState.size" ></HabitIcon>
</template>

<style scoped>

</style>