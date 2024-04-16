<!--This is the root vue file
Import components like this
import HelloWorld from './components/HelloWorld.vue'
(no need to export components; the name of the component is the name of the file, excluding the .vue extension)
To use components:
<HelloWorld />
-->

<script setup lang="ts">
import HabitIcon from "./icons/HabitIcon.vue";
</script>

<template>
    <main>
        <h1>Habit Tracker</h1>
        <HabitIcon id=""></HabitIcon>
    </main>
</template>

<style scoped>
</style>