<template>
  <CalendarComponent />
</template>

<script setup lang="ts">
import CalendarComponent from '@/components/shared/CalendarComponent.vue'
</script>

<style scoped>

:deep(.vuecal__event) {
  background-color: #1e2a38 !important;
}

:deep(.vuecal__event.event-blue) {
  background-color: #1e2a38 !important;
}

:deep(.vuecal__event.event-green) {
  background-color: #2d3a4b !important;
}

:deep(.vuecal__event.event-orange) {
  background-color: #34495e !important;
}

:deep(.vuecal__event.event-red) {
  background-color: #2c3e50 !important;
}

:deep(.vuecal__event.event-purple) {
  background-color: #283747 !important;
}

:deep(.vuecal__title-bar) {
  background-color: #1e2a38 !important;
}

:deep(.vuecal__cell--selected) {
  background-color: rgba(30, 42, 56, 0.1) !important;
}

:deep(.vuecal__cell--today) {
  background-color: rgba(30, 42, 56, 0.05) !important;
}

:deep(.btn-primary) {
  background-color: #1e2a38 !important;
}

:deep(.btn-primary:hover) {
  background-color: #2d3a4b !important;
}

:deep(.vuecal__view-btn) {
  color: #1e2a38 !important;
}

:deep(.vuecal__view-btn--active) {
  background-color: transparent !important;
  border-bottom-color: #1e2a38 !important;
  color: #1e2a38 !important;
}
:deep(h1) {
  color: #1e2a38 !important;
}
</style>
