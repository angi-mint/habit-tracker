<script setup lang="ts">
import {BarChart} from 'vue-chart-3';
import {PropType} from "vue";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

const DataProps = defineProps({
    interval: String,
    labels: Array as PropType<Array<string>>,
    data: Array as PropType<Array<number>>,
    colors: Array as PropType<Array<string>>,
});

const HabitData = {
    labels: DataProps.labels,
    datasets: [{
        label: '% der Erreichten Habits',
        data: DataProps.data,
        backgroundColor: DataProps.colors,
    }]
}

</script>

<template>
    <BarChart :chartData="HabitData" />
</template>

<style scoped>

</style>