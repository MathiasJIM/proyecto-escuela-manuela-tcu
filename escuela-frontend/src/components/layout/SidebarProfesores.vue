<template>
  <aside class="dashboard-sidebar">
    <div class="sidebar-header">
      <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" class="sidebar-logo" />
      <h2 class="sidebar-title">Portal Docente</h2>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="sidebar-menu">
        <li v-for="item in menuItems" :key="item.path" class="sidebar-menu-item">
          <router-link 
            :to="item.path" 
            class="sidebar-link"
            :class="{ 'active': isActive(item.path) }"
          >
            <span class="sidebar-icon">
              <font-awesome-icon :icon="item.icon" />
              <span v-if="item.name === 'Notificaciones' && cantidadNoLeidas > 0" class="notification-badge">{{ cantidadNoLeidas }}</span>
            </span>
            <span class="sidebar-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <font-awesome-icon icon="fa-user" />
        </div>
        <div class="user-details">
          <p class="user-name">{{ userName }}</p>
          <p class="user-role">Profesor</p>
        </div>
      </div>
      <button class="logout-button" @click="cerrarSesion">
        <font-awesome-icon icon="fa-sign-out-alt" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useNotificacionesStore } from '@/stores/notificacionesStore';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const notificacionesStore = useNotificacionesStore();
const authStore = useAuthStore();

const cantidadNoLeidas = computed(() => notificacionesStore.cantidadNoLeidas);

const userName = computed(() => authStore.userName);

const menuItems = [
  { name: 'Inicio', path: '/dashboard/profesores/inicio', icon: 'fa-home' },
  { name: 'Asistencia', path: '/dashboard/profesores/asistencia', icon: 'fa-clipboard-check' },
  { name: 'Calendario', path: '/dashboard/profesores/calendario', icon: 'fa-calendar-alt' },
  { name: 'Citas', path: '/dashboard/profesores/citas', icon: 'fa-users' },
  { name: 'Material', path: '/dashboard/profesores/material', icon: 'fa-book' },
  { name: 'Notificaciones', path: '/dashboard/profesores/notificaciones', icon: 'fa-bell' },
  { name: 'Perfil', path: '/dashboard/profesores/perfil', icon: 'fa-user' },
];

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

const cerrarSesion = async () => {
  await authStore.logout();
  router.replace({ name: 'login' });
};
</script>

<style scoped>
@import '@/assets/styles/dashboards/profesores/sidebar.css';
</style>
