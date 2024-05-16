<script setup lang="ts">
import {BarChart} from 'vue-chart-3';
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
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / (7 * 24 * 60 * 60 * 1000));
};

const getLast4ISOWeekNumbers = (): Array<string> => {
    const weekNumbers = [];

    for (let i = 4; i > 0; i--) {
        const date = new Date(currentDay);
        date.setDate(currentDay.getDate() - (currentDay.getDay() + 7 * (i - 1)));
        const weekNumber = getISOWeekNumber(date);
        weekNumbers.push(`KW${weekNumber}`);
    }

    return weekNumbers;
};
function createLabels() {
    if (DataProps.habit?.interval === 0) {
        return ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    } else if (DataProps.habit?.interval === 1) {
        return getLast4ISOWeekNumbers();
    }
}

function prepareArr(arr: Array<string>): Array<number> {
    const resultArr = (DataProps.habit?.interval === 0) ? new Array(7).fill(0) : new Array(4).fill(0);
    const newArr = arr.map((date) => Number(date.split("-")[2]));

    if (DataProps.habit!.interval === 0) {
        const date = new Date(currentDay);
        date.setDate(currentDay.getDate() - (currentDay.getDay() + 7 ));
        resultArr.forEach((_, index) => {
            const dayNumber = Number(date.getDate());
            const count = newArr.filter((date) => date === dayNumber).length;
            resultArr[index] = (count / DataProps.habit!.frequency) * 100;
            date.setDate(date.getDate() + 1);
        });
    } else {
        const weekNumbers = getLast4ISOWeekNumbers();
        const day = new Date(currentDay);
        day.setDate(currentDay.getDate() - (currentDay.getDay() + 7 * 4));
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
    }
    return resultArr;
}

const HabitData = {
    labels: createLabels(),
    datasets: [{
        label: '% der Erreichten Habits',
        data: prepareArr(DataProps.habit!.dates),
        backgroundColor: DataProps.habit!.color,
    }]
}

</script>

<template>
    <BarChart :chartData="HabitData" />
    {{HabitData}}
    {{DataProps.habit}}
</template>

<style scoped>

</style>