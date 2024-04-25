<script setup lang="ts">
import HabitIcon from "../icons/HabitIcon.vue";

const IconState = defineProps({
    id: String,
    color: String,
});

</script>

<template>
    <HabitIcon :id="IconState.id!" :color="IconState.color" :size='40' ></HabitIcon>
</template>

<style scoped>

</style>