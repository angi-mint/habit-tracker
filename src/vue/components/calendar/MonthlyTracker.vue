<script setup lang="ts">
import {PropType} from "vue";
import {DateInfo} from "./MonthlyOverview.vue";
import Icon from "./Icon.vue";
import TrackButton from "./TrackButton.vue";

const HabitMonthly = defineProps({
    id: Number,
    name: String,
    icon: String,
    color: String,
    frequency: Number,
    interval: String,
    dates: Array as PropType<Array<string>>,
    dateInfo: Object as PropType<DateInfo>,
});

function monthInfo(): { totalDays: number, weeks: number, firstWeekStart: number, daysInLastWeek: number } {
    const totalDays = HabitMonthly.dateInfo!.daysInMonth + getFirstWeekday();
    return {
        totalDays: totalDays,
        weeks: Math.ceil(totalDays / 7),
        firstWeekStart: getFirstWeekday(),
        daysInLastWeek: totalDays % 7
    };
}

function getFirstWeekday(): number {
    const firstDay = new Date(HabitMonthly.dateInfo!.year, HabitMonthly.dateInfo!.month, 1);
    const day = firstDay.getDay();
    return day === 0 ? 6 : day - 1;
}

function prepareArray(arr: Array<string>): Array<number> {
    const resultArr: Array<number> = new Array(HabitMonthly.dateInfo!.daysInMonth).fill(0);
    const newArr = arr.map((date) => Number(date.split("-")[2]));
    resultArr.forEach((_day, index) => {
        const count = newArr.filter((date) => date === index + 1).length;
        resultArr[index] = (count / HabitMonthly.frequency!) * 100;
    });
    return resultArr;
}

const iconSize = 40;
const datesArray = [...new Array(monthInfo().firstWeekStart).fill(-1),
                    ...prepareArray(HabitMonthly.dates!),
                    ...new Array(7 - monthInfo().daysInLastWeek).fill(-1)];
</script>

<template>
    <div class="monthly-habit">
        <Icon :id="HabitMonthly.icon" :color="HabitMonthly.color" :size="iconSize"></Icon>
        <div class="monthly-wrapper">
            <h3 class="habit-name">{{ HabitMonthly.name }}</h3>
            <div class="monthly-view">
                <div class="monthly-week" v-for="(week, index) in monthInfo().weeks" :key="index">
                    <div v-for="n in 7" :key="n" class="monthly-day">
                        <svg v-if="datesArray[(n + 7 * index) - 1] === -1" :width="iconSize" :height="iconSize" viewBox="0 0 16 16"></svg>
                        <TrackButton v-else :id="HabitMonthly.id" :color="HabitMonthly.color" :percentage="datesArray[(n + 7 * index) - 1]" :size="iconSize"></TrackButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>