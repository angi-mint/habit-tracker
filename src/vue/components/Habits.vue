<script setup lang="ts">
import Tabs from "./tabs/Tabs.vue";
import Tab from "./tabs/Tab.vue";
import {Ref, ref} from "vue";
import DailyOverview from "./calendar/DailyOverview.vue";

const states: Ref<{ [key: string]: boolean }> = ref({
    today: true,
    weekly: false,
    summary: false
});

function changeStates(tab: string) {
    for (const state in states.value) {
        states.value[state] = state === tab;
    }
}

</script>

<template>
    <Tabs>
        <template #selector>
            <button @click="changeStates('today')" :class="{ 'tab-active': states.today }" class="tab-selector">Heute</button>
            <button @click="changeStates('weekly')" :class="{ 'tab-active': states.weekly }" class="tab-selector">Wöchentlich</button>
            <button @click="changeStates('summary')" :class="{ 'tab-active': states.summary }" class="tab-selector">Übersicht</button>
        </template>
        <template #content>
            <Tab v-if="states.today">
                <DailyOverview></DailyOverview>
            </Tab>
            <Tab v-if="states.weekly">Weekly Content</Tab>
            <Tab v-if="states.summary">Summary Content</Tab>
        </template>
    </Tabs>
</template>

<style scoped>

</style>