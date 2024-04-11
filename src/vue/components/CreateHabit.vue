<script setup lang="ts">

import HabitIcon from "./icons/HabitIcon.vue";
import LabelForm from "./form/LabelForm.vue";
import {computed, Ref, ref} from "vue";

const open = ref(false);

interface HabitProps {
    name: string,
    icon?: number,
    // color?: number,
    category?: number,
    //frequency: number,
    //interval: number,
    // timeperiod: number,
    // startDate?: Date,
    // endDate?: Date
}

const habitName = ref('');
const habitCategory = ref('');
const habitIcon = ref('');

const onSubmit = () => {
    const formData: HabitProps = {
        name: habitName.value,
        icon: Number(habitIcon.value),
        category: Number(habitCategory.value),
    }
    console.log('New Habit created:', formData)
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
    ]

    return icon;
})

</script>

<template>
    <button @click="open = true">Neues Habit</button>
    <Teleport to="body">
        <div v-if="open" class="modal">
            <div class="modal-content">
                <h3>Neues Habit erstellen</h3>
                <button @click="open = false" class="btn-exit">x</button>
                <form @submit.prevent="onSubmit">

                    <LabelForm required>
                        <template v-slot:form-label><p>Name</p></template>
                        <template v-slot:input>
                            <input class="form-input" type="text" v-model="habitName" placeholder="Wie soll dein Habit heißen?"/>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label>Kategorie</template>
                        <template #input>
                            <select v-if="categories.length > 0" v-model="habitCategory">
                                <option disabled value=""> Wähle eine Kategorie</option>
                                <option v-for="items in categories" :value="items.pk">
                                    {{ items.value }}
                                </option>
                            </select>
                            <p v-else>Es gibt keine Kategorien</p>
                        </template>
                    </LabelForm>

                    <LabelForm>
                        <template #form-label>Icon</template>
                        <template #input>
                            <label v-for="items in icons">
                                <input type="radio" v-model="habitIcon" :value=items.pk />
                                <HabitIcon :id=items.value />
                            </label>
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