<template>
  <div class="public-layout">
    <TheNavbar />
    <router-view />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
</script>

<style scoped>
.public-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
