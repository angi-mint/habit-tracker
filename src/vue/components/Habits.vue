<script setup lang="ts">
import Tabs from "./tabs/Tabs.vue";
import Tab from "./tabs/Tab.vue";
import {Ref, ref} from "vue";
import DailyOverview from "./calendar/DailyOverview.vue";
import MonthlyOverview from "./calendar/MonthlyOverview.vue";
import WeeklyOverview from "./calendar/WeeklyOverview.vue";

const states: Ref<{ [key: string]: boolean }> = ref({
    today: true,
    weekly: false,
    monthly: false
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
            <button @click="changeStates('weekly')" :class="{ 'tab-active': states.weekly }" class="tab-selector">Woche</button>
            <button @click="changeStates('monthly')" :class="{ 'tab-active': states.monthly }" class="tab-selector">Monat</button>
        </template>
        <template #content>
            <Tab v-if="states.today">
                <DailyOverview></DailyOverview>
            </Tab>
            <Tab v-if="states.weekly">
                <WeeklyOverview></WeeklyOverview>
            </Tab>
            <Tab v-if="states.monthly">
                <MonthlyOverview></MonthlyOverview>
            </Tab>
        </template>
    </Tabs>
</template>

<style scoped>

</style>