<script setup lang="ts">
import CreateHabit from "./CreateHabit.vue";
import Settings from "./Settings.vue";
import {Ref, ref} from "vue";
import Tabs from "./tabs/Tabs.vue";
import Tab from "./tabs/Tab.vue";
import Body from "./Body.vue";
import HabitChartOverview from "./chart/HabitChartOverview.vue";

const states: Ref<{ [key: string]: boolean }> = ref({
    home: true,
    statistics: false
});

function changeStates(tab: string) {
    for (const state in states.value) {
        states.value[state] = state === tab;
    }
}
const reloader = ref(0);

const handleReloade = () => {
    reloader.value += 1;
};

</script>

<template>
    <h1>Willkommen zurück!</h1>
    <div class="header-actions">
        <CreateHabit @reload-create-habit="handleReloade()" :fixed="true" submit="Erstellen" :id="-1">
            <template #btn-content>+
            </template>
            <template #title>
                <h3>Neues Habit erstellen</h3>
            </template>
        </CreateHabit>
        <Settings />
    </div>
    <Tabs :key="reloader">
        <template #selector>
            <button @click="changeStates('home')" :class="{ 'tab-active': states.home }" class="tab-selector">Home</button>
            <button @click="changeStates('statistics')" :class="{ 'tab-active': states.statistics }" class="tab-selector">Statistics</button>
        </template>
        <template #content>
            <Tab v-if="states.home">
                <Body></Body>
            </Tab>
            <Tab v-if="states.statistics">
                <h1>Statistiken</h1>
                <HabitChartOverview></HabitChartOverview>
            </Tab>
        </template>
    </Tabs>
</template>

<style scoped>

</style>