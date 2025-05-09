<template>
  <div class="dashboard-layout">
    <SidebarDireccion>
      <router-view />
    </SidebarDireccion>
  </div>
</template>

<script setup lang="ts">
import SidebarDireccion from '@/components/layout/SidebarDireccion.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color-light);
}
</style>
