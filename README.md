# habit-tracker

## Clone

Clone the repository
```commandline
git clone git@github.com:angi-mint/habit-tracker.git
```
```commandline
cd habit-tracker
```

Install the dependencies, use `ci` not `i`
```commandline
npm ci
```

## Code

all code for the website will be in the `src` folder
- CSS: `assets/index.css`
- HTML for the website:
  - single components: `vue/components/*\<componentName>*.vue`
  - single components can then be imported into `App.vue`  

## Vue file structure

```vue
<script setup lang="ts">
  // script goes here
</script>

<template>
  <!--  html goes here-->
</template>

<style scoped>
  /* style required for script goes here */
</style>
```
