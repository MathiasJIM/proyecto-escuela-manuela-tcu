<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Layout para páginas de autenticación (login, registro, etc.)
// No incluye navbar ni footer
</script>

<style scoped>
.auth-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
