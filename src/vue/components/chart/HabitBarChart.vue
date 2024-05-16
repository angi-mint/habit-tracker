<script setup lang="ts">
import {BarChart} from 'vue-chart-3';
import {PropType} from "vue";
import {Chart, registerables} from "chart.js";
import {Habit} from "../calendar/DailyOverview.vue";

Chart.register(...registerables);

const DataProps = defineProps({
    habit: Object as PropType<Habit>,
});
function prepareArr(arr: Array<string>) {

}

function createLabels() {

}

// const HabitData = {
//     labels: DataProps.labels,
//     datasets: [{
//         label: '% der Erreichten Habits',
//         data: DataProps.data,
//         backgroundColor: DataProps.colors,
//     }]
// }

</script>

<template>
    <BarChart :chartData="HabitData" />
</template>

<style scoped>

</style>