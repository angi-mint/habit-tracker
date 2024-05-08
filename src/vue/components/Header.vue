<script setup lang="ts">
import CreateHabit from "./CreateHabit.vue";
import Settings from "./Settings.vue";
</script>

<template>
    <h1>Willkommen zurück!</h1>
    <div class="header-actions">
        <CreateHabit :fixed="true" submit="Erstellen" :id="-1">
            <template #btn-content>+
            </template>
            <template #title>
                <h3>Neues Habit erstellen</h3>
            </template>
        </CreateHabit>
        <Settings />
    </div>
</template>

<style scoped>

</style>