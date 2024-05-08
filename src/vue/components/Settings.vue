<script setup lang="ts">

import {ref} from "vue";
import LabelForm from "./form/LabelForm.vue";

const open = ref(false);

const icalData = ref({
    url: '',
    username: '',
    password: '',
})

const onSubmit = async () => {
    await window.api.saveICalCredentials(JSON.parse(JSON.stringify(icalData.value)));
    open.value = false;
}

</script>

<template>
<button @click="open = true" class="btn">
    <svg xmlns="http://www.w3.org/2000/svg" id="gear" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
    </svg>
</button>
<Teleport to="body">
    <div v-if="open" class="modal">
        <div class="modal-content">
            <h3>iCal Verbindungsdaten</h3>
            <button @click="open = false" class="btn-exit btn">x</button>
            <form @submit.prevent="onSubmit">
                <LabelForm required>
                    <template #form-label><p>URL</p></template>
                    <template #input>
                        <input class="form-input" type="url" v-model="icalData.url" required/>
                    </template>
                </LabelForm>

                <LabelForm required>
                    <template #form-label><p>Nutzername</p></template>
                    <template #input>
                        <input class="form-input" type="text" v-model="icalData.username" required>
                    </template>
                </LabelForm>

                <LabelForm required>
                    <template #form-label><p>Passwort</p></template>
                    <template #input>
                        <input class="form-input password" type="password" v-model="icalData.password" required>
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