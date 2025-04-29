<script setup lang="ts">
import '@/assets/css/variables.css'
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}

body {
  font-family: var(--font-family-body);
  line-height: 1.6;
  color: var(--text-dark);
  background-color: var(--bg-light);
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


</style>
