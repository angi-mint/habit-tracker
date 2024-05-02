<script setup lang="ts">

import HabitIcon from "./icons/HabitIcon.vue";
import LabelForm from "./form/LabelForm.vue";
import {computed, onMounted, Ref, ref} from "vue";

const open = ref(false);

const habitData = ref({
    name: '',
    icon: '',
    color: 1,
    category: '',
    interval: '',
    frequency: 1,
    timeperiod: false,
    startDate: '',
    endDate: '',
})

const onSubmit = async () => {
    await window.api.sendHabitObject(JSON.parse(JSON.stringify(habitData.value)));
    await fetchCategoryList();
    open.value = false;
}

interface DatabaseList {
    id: number;
    name: string;
}

const categories = ref<Array<DatabaseList>>([]);

const fetchCategoryList = async () => {
    categories.value = (await window.api.getCategoryList()).map((category: DatabaseList) => ({
        id: category.id,
        name: category.name
    }));
};

onMounted(async () => await fetchCategoryList());

const icons: Ref<Array<DatabaseList>> = computed(() => {
    const icon = [
        { id: 1, name: "heart" },
        { id: 2, name: "pill" },
        { id: 3, name: "book" },
        { id: 4, name: "glass" },
    ];

    return icon;
});

const intervals: Ref<Array<DatabaseList>> = computed(() => {
    return [
        { id: 1, name: "täglich" },
        { id: 2, name: "wöchentlich" },
        { id: 3, name: "monatlich"}
    ];
});

</script>

<template>
    <button class="btn-habit" @click="open = true">+</button>
    <Teleport to="body">
        <div v-if="open" class="modal">
            <div class="modal-content">
                <h3>Neues Habit erstellen</h3>
                <button @click="open = false" class="btn-exit">x</button>
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

                    <LabelForm>
                        <template #form-label><p>Icon</p></template>
                        <template #input>
                            <label v-for="items in icons">
                                <input type="radio" v-model="habitData.icon" :value=items.id />
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
                            <label class="toggler-wrapper">
                                <input type="checkbox" v-model="habitData.timeperiod">
                                <div class="toggler-slider">
                                    <div class="toggler-knob"></div>
                                </div>
                            </label>
                        </template>
                        <template #input>
                            <div v-if="habitData.timeperiod" class="form-input">
                                <input class="form-input" type="date" v-model="habitData.startDate" required>
                                <span> - </span>
                                <input class="form-input" type="date" v-model="habitData.endDate" required>
                            </div>
                        </template>
                    </LabelForm>
                    <input type="submit">
                </form>
            </div>
        </div>
    </Teleport>
</template>
<style scoped>

</style>