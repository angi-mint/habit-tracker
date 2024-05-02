<script setup lang="ts">

import HabitIcon from "./icons/HabitIcon.vue";
import LabelForm from "./form/LabelForm.vue";
import {computed, Ref, ref} from "vue";

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
    return [
        { pk: 1, value: "täglich" },
        { pk: 2, value: "wöchentlich" },
        { pk: 3, value: "monatlich"}
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
                                <option v-for="items in categories" :value="items.value"></option>
                            </datalist>
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