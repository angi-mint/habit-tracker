<script setup lang="ts">

import HabitIcon from "./icons/HabitIcon.vue";
import LabelForm from "./form/LabelForm.vue";
import {computed, Ref, ref} from "vue";

const open = ref(false);

interface HabitProps {
    name: string,
    icon?: number,
    color?: number,
    category?: number,
    frequency: number,
    interval: number,
    timeperiod: number,
    startDate?: Date,
    endDate?: Date
}
const habitData = ref({
    name: '',
    icon: '',
    category: '',
    interval: '',
    frequency: 1,
    range: false,
    startDate: '',
    endDate: '',
})
const onSubmit = () => {
    console.log(habitData.value)
    open.value = false;
}

interface DatabaseList {
    pk: number;
    value: string;
}

const categories: Ref<Array<DatabaseList>> = computed(() => {
    const category = [
        { pk: 1, value: "Sport" },
        { pk: 2, value: "Health" }
    ];

    return category;
});

const icons: Ref<Array<DatabaseList>> = computed(() => {
    const icon = [
        { pk: 1, value: "heart" },
        { pk: 2, value: "pill" },
        { pk: 3, value: "book" },
        { pk: 4, value: "glass" },
    ];

    return icon;
});

const intervals: Ref<Array<DatabaseList>> = computed(() => {
    const interval = [
        { pk: 1, value: "täglich" },
        { pk: 2, value: "wöchentlich" },
        { pk: 3, value: "zweiwöchentlich" },
        { pk: 4, value: "monatlich" },
    ];
    return interval;
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
                            <select class="form-input" v-if="categories.length > 0" v-model="habitData.category">
                                <option disabled value=""> Wähle eine Kategorie</option>
                                <option v-for="items in categories" :value="items.pk">
                                    {{ items.value }}
                                </option>
                            </select>
                            <p v-else>Es gibt keine Kategorien</p>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label><p>Icon</p></template>
                        <template #input>
                            <label v-for="items in icons">
                                <input type="radio" v-model="habitData.icon" :value=items.pk />
                                <HabitIcon :id=items.value />
                            </label>
                        </template>
                    </LabelForm>

                    <LabelForm required>
                        <template #form-label><p>Intervall</p></template>
                        <template #input>
                            <select class="form-input" v-model="habitData.interval" required>
                                <option disabled value="">Wähle ein Intervall</option>
                                <option v-for="items in intervals" :value="items.pk">
                                    {{ items.value }}
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
                                <input type="checkbox" v-model="habitData.range">
                                <div class="toggler-slider">
                                    <div class="toggler-knob"></div>
                                </div>
                            </label>
                        </template>
                        <template #input>
                            <div v-if="habitData.range" class="form-input">
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