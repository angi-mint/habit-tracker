<script setup lang="ts">
import {WeekInfo} from "./WeeklyOverview.vue";
import {PropType} from "vue";
import Icon from "./Icon.vue";
import TrackButton from "./TrackButton.vue";

const HabitWeekly = defineProps({
    id: Number,
    name: String,
    icon: String,
    color: String,
    frequency: Number,
    interval: String,
    dates: Array as PropType<Array<string>>,
    weekInfo: Object as PropType<WeekInfo>,
});

function prepareArray(arr: Array<string>): Array<number>{
    const resultArr: Array<number> = new Array(7).fill(0);
    const newArr = arr.map((date) => Number(date.split("-")[2]));

    const firstDay = HabitWeekly.weekInfo!.firstDayOfWeek;
    resultArr.forEach((_day, index) => {
        const dayNumber = Number(firstDay.getDate());
        const count = newArr.filter((date) => date === dayNumber).length;
        resultArr[index] = (count / HabitWeekly.frequency!) * 100;
        firstDay.setDate(firstDay.getDate() + 1);
    })
    return resultArr;
}

const iconSize = 40;
const datesArray = prepareArray(HabitWeekly.dates!);
</script>

<template>
    <div class="weekly-habit">
        <Icon :id="HabitWeekly.icon" :color="HabitWeekly.color" :size="iconSize"></Icon>
        <div class="weekly-wrapper">
            <h3 class="weekly-name">{{ HabitWeekly.name }}</h3>
            <div class="weekly-overview">
                <div class="weekly-view" v-for="(day, index) in datesArray" :key="index">
                    <TrackButton :id="HabitWeekly.id" :color="HabitWeekly.color" :percentage="day" :size="iconSize" :disabled="index + 1 !== today"></TrackButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>