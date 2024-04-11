<script setup lang="ts">
const props = defineProps({
    required: Boolean,
})
</script>

<template>
    <label class="form-label">
        <slot name="form-label"></slot>
        <p class="form-required" v-if="props.required">*</p>
    </label>
    <slot name="input"></slot>
</template>

<style scoped>

</style>S