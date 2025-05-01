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
          <p class="user-name">Nombre Docente</p>
          <p class="user-role">Profesor</p>
        </div>
      </div>
      <button class="logout-button">
        <font-awesome-icon icon="fa-sign-out-alt" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';

const route = useRoute();

// Elementos del menú
const menuItems = [
  { name: 'Inicio', path: '/dashboard/profesores/inicio', icon: 'fa-home' },
  { name: 'Asistencia', path: '/dashboard/profesores/asistencia', icon: 'fa-clipboard-check' },
  { name: 'Calendario', path: '/dashboard/profesores/calendario', icon: 'fa-calendar-alt' },
  { name: 'Citas', path: '/dashboard/profesores/citas', icon: 'fa-users' },
  { name: 'Material', path: '/dashboard/profesores/material', icon: 'fa-book' },
  { name: 'Notificaciones', path: '/dashboard/profesores/notificaciones', icon: 'fa-bell' },
  { name: 'Perfil', path: '/dashboard/profesores/perfil', icon: 'fa-user' },
];

// Función para verificar si un elemento del menú está activo
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script>

<style scoped>
@import '@/assets/styles/dashboards/profesores/sidebar.css';

</style>
