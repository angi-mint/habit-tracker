<script setup lang="ts">
import { ref } from 'vue';


let customMessage = "Hello from the renderer process!";
let count = ref(0);
let name = ref("noch leer");

window.api.onCount((data: any) => {
    count.value = data;
});

const sendMessage = () => {
    window.api.sendMsg(customMessage);
    customMessage = "";
}

const getUsage = async () => {
    const data = await window.api.sendPromise("Hello tihs is a test message!");
    console.log(data);
}

const getHabitName = async () => {
    const habit = await window.api.sendHabitName({ id: 1 });
    name.value = habit;
}

</script>

<template>
    <div id="testkp">
        <h3>{{ count }}</h3>
        <hr>
        <input type="text" v-model="customMessage" />    

        <button @click="sendMessage">Send Message</button>
        <button @click="getUsage">Used Bytes</button>
        <br><br><br>
        <p>Name des Habit: {{ name }}</p>
        <button @click="getHabitName">Get Name</button>
        
    </div>
</template>

<style scoped>
#testkp {
border: 5px solid black;
margin-top: 50px;
}
</style>