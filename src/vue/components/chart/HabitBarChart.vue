<script setup lang="ts">
import {BarChart, PieChart} from 'vue-chart-3';
import {Chart, registerables} from "chart.js";
import {Habit} from "../calendar/DailyOverview.vue";

Chart.register(...registerables);
const currentDay = new Date();

const DataProps = defineProps({
    habit: Object,
});

const getISOWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNumber = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 6) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / (6 * 24 * 60 * 60 * 1000));
};

const getLast4ISOWeekNumbers = (): Array<string> => {
    const weekNumbers = [];

    for (let i = 4; i > 0; i--) {
        const date = new Date(currentDay);
        date.setDate(currentDay.getDate() - (currentDay.getDay() + 6 * (i - 1)));
        const weekNumber = getISOWeekNumber(date);
        weekNumbers.push(`KW${weekNumber}`);
    }

    return weekNumbers;
};
function createLabels() {
    if (DataProps.habit?.interval === 1) {
        return ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    } else if (DataProps.habit?.interval === 2) {
        return getLast4ISOWeekNumbers();
    } else if (DataProps.habit?.interval === 3) {
        return [new Intl.DateTimeFormat('de', { month: 'long' }).format(currentDay), "Verpasste Habits"];
    }
}

function prepareArr(arr: Array<string>): Array<number> {
    const resultArr = (DataProps.habit?.interval === 1) ? new Array(7).fill(0) : new Array(4).fill(0);
    const newArr = arr.map((date) => Number(date.split("-")[2]));

    if (DataProps.habit!.interval === 1) {
        const date = new Date(currentDay);
        date.setDate(currentDay.getDate() - (currentDay.getDay() + 6 ));
        resultArr.forEach((_, index) => {
            const dayNumber = Number(date.getDate());
            const count = newArr.filter((date) => date === dayNumber).length;
            resultArr[index] = (count / DataProps.habit!.frequency) * 100;
            date.setDate(date.getDate() + 1);
        });
    } else if (DataProps.habit!.interval === 2) {
        const weekNumbers = getLast4ISOWeekNumbers();
        const day = new Date(currentDay);
        day.setDate(currentDay.getDate() - (currentDay.getDay() + 6 * 4));
        weekNumbers.forEach((weekNumber, index) => {
            const count = newArr.filter((date) => {
                for (let i = 0; i < 7; i++) {
                    if (date === Number(day.setDate(day.getDate() + 1))) {
                        return true;
                    }
                }
            }).length;
            resultArr[index] = (count / DataProps.habit!.frequency) * 100;
        });
    } else {
        console.log(newArr, DataProps.habit!.frequency)
        const finished = (newArr.length / DataProps.habit!.frequency) * 100;
        console.log(finished)
        const remaining = 100 - finished;
        resultArr.push(finished, remaining);
    }
    return resultArr;
}

const HabitData = {
    labels: createLabels(),
    datasets: [{
        label: '% der Erreichten Habits',
        data: prepareArr(DataProps.habit!.dates),
        backgroundColor: (DataProps.habit!.interval === 3) ? [DataProps.habit!.color, "#9d9a9a"] : DataProps.habit!.color,
    }]
}

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true,
            max: 100
        }
    }
};

const interval = DataProps.habit!.interval === 1 ? "am Tag" : (DataProps.habit!.interval === 2 ? "in der Woche" : "im Monat");

</script>

<template>
    <h2>{{DataProps.habit!.name}} ({{DataProps.habit!.frequency}} {{interval}})</h2>
    <PieChart v-if="DataProps.habit!.interval === 3" :chartData="HabitData"/>
    <BarChart v-else :chartData="HabitData" :options="chartOptions"/>
</template>

<style scoped>

</style>