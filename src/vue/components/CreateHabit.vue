<script setup lang="ts">

import HabitIcon from "./icons/HabitIcon.vue";
import LabelForm from "./form/LabelForm.vue";
import {computed, onMounted, PropType, Ref, ref} from "vue";
import {Habit} from "./calendar/DailyOverview.vue";

const open = ref(false);

const Props = defineProps({
    id: Number,
    fixed: Boolean,
    submit: String,
    delete: Boolean,
    habitData: Object as PropType<Habit>
});

const defaultHabitData: Habit = {
    id: -1,
    name: '',
    icon: '',
    color: 1,
    category: '',
    frequency: 1,
    entries: 0,
    interval: '',
    timeperiod: false,
    startDate: '',
    endDate: '',
    calendar: false,
    startTime: '',
    endTime: '',
    todo: false,
};

const habitData = (Props.id === -1) ? ref(defaultHabitData) : ref(Props.habitData as Habit);

interface DatabaseList {
    id: number;
    name: string;
}

const categories = ref<Array<DatabaseList>>([]);
const colors = ref<Array<DatabaseList>>([]);

const fetchList = async () => {
    colors.value = (await window.api.getColorList()).map((color: DatabaseList) => ({
        id: color.id,
        name: color.name
    }));

    categories.value = (await window.api.getCategoryList()).map((category: DatabaseList) => ({
        id: category.id,
        name: category.name
    }));
};

const icons: Ref<Array<DatabaseList>> = computed(() => {
    return [{id: 1, name: "heart"}, {id: 2, name: "pill"}, {id: 3, name: "book"}, {id: 4, name: "glass"},];
});

const intervals: Ref<Array<DatabaseList>> = computed(() => {
    return [{ id: 1, name: "täglich" }, { id: 2, name: "wöchentlich" }, { id: 3, name: "monatlich"}];
});

onMounted(async () => {
    await fetchList();
});

const emit = defineEmits(['reloadCreateHabit']);
const onSubmit = async () => {
    if (Props.fixed) await window.api.sendHabitObject(JSON.parse(JSON.stringify(habitData.value)));
    else await window.api.updateHabitObject(JSON.parse(JSON.stringify(habitData.value)));

    await fetchList();
    habitData.value = defaultHabitData;
    emit('reloadCreateHabit');
    open.value = false;
}

async function deleteHabit() {
    await window.api.deleteHabit(habitData.value.id);
    emit('reloadCreateHabit');
    habitData.value = defaultHabitData;
    open.value = false;
}

</script>

<template>
    <button :class="{'btn-habit btn': Props.fixed}" @click="open = true">
        <slot name="btn-content"></slot>
    </button>
    <Teleport to="body">
        <div v-if="open" class="modal">
            <div class="modal-content">
                <slot name="title"></slot>
                <button @click="open = false" class="btn-exit btn">x</button>
                <form @submit.prevent="onSubmit">
                    <LabelForm required>
                        <template #form-label><p>Name</p></template>
                        <template #input>
                            <input class="form-input" type="text" v-model="habitData.name" placeholder="z.B. Wasser trinken" required/>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label><p>Kategorie</p></template>
                        <template #input>
                            <input class="form-input" list="categories" v-model="habitData.category">
                            <datalist id="categories">
                                <option v-for="items in categories" :value="items.name"></option>
                            </datalist>
                        </template>
                    </LabelForm>

                    <LabelForm required>
                        <template #form-label><p>Farbe</p></template>
                        <template #input>
                            <label v-for="items in colors">
                                <input type="radio" v-model="habitData.color" :value="items.id" :checked="Props.habitData?.color === items.name" name="color" required>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" :fill="items.name" viewBox="0 0 16 16">
                                    <circle cx="8" cy="8" r="8"/>
                                </svg>
                            </label>
                        </template>
                    </LabelForm>

                    <LabelForm required>
                        <template #form-label><p>Icon</p></template>
                        <template #input>
                            <label v-for="items in icons">
                                <input type="radio" v-model="habitData.icon" :value=items.id :checked="Props.habitData?.icon === items.name" name="icon" required>
                                <HabitIcon :id=items.name />
                            </label>
                        </template>
                    </LabelForm>

                    <LabelForm required>
                        <template #form-label><p>Intervall</p></template>
                        <template #input>
                            <select class="form-input" v-model="habitData.interval" required>
                                <option disabled value="">Wähle ein Intervall</option>
                                <option v-for="items in intervals" :value="items.id">
                                    {{ items.name }}
                                </option>
                            </select>
                        </template>
                    </LabelForm>

                    <LabelForm required>
                        <template #form-label><p>Häufigkeit</p></template>
                        <template #input>
                            <input class="form-input form-number" type="number" min="1" v-model="habitData.frequency" required>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label><p>Zeitraum</p>
                                <input type="checkbox" v-model="habitData.timeperiod" v-bind:true-value="1">
                        </template>
                        <template #input>
                            <div v-if="habitData.timeperiod" class="form-input">
                                <input class="form-input" type="date" v-model="habitData.startDate" required>
                                <span> - </span>
                                <input class="form-input" type="date" v-model="habitData.endDate" required>
                            </div>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label><p>Im Kalendar anzeigen</p>
                            <input type="checkbox" v-model="habitData.calendar" v-bind:true-value="1">
                        </template>
                        <template #input>
                            <div v-if="habitData.calendar" class="form-input">
                                <p>Uhrzeit festlegen:</p>
                                <input class="form-input" type="time" v-model="habitData.startTime" required>
                                <span> - </span>
                                <input class="form-input" type="time" v-model="habitData.endTime" required>
                            </div>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label><p>Als ToDo anzeigen</p>
                            <input type="checkbox" v-model="habitData.todo" v-bind:true-value="1">
                        </template>
                    </LabelForm>
                    <button class="btn-delete" v-if="Props.delete" @click="deleteHabit();">Löschen</button>
                    <input type="submit" :value="Props.submit">
                </form>
            </div>
        </div>
    </Teleport>
</template>
<style scoped>

</style>