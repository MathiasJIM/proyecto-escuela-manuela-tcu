<template>
  <div class="dashboard-layout">
    <DashboardSidebar />
    <main class="dashboard-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '@/components/layout/DashboardSidebar.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.dashboard-content {
  flex: 1;
  margin-left: 280px;
  background-color: var(--bg-off-white);
  min-height: 100vh;
}

.content-wrapper {
  padding: var(--spacing-xl);
  max-width: 1600px;
  margin: 0 auto;
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .dashboard-content {
    margin-left: 70px;
  }
}
</style>
