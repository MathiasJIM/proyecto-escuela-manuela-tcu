<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" class="logo" />
      <h2 class="title">Portal Dirección</h2>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="menu">
        <!-- Inicio -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/inicio" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/inicio') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-home" />
            </span>
            <span class="text">Inicio</span>
          </router-link>
        </li>
        
        <!-- Gestión de Usuarios -->
        <li class="menu-item">
          <div 
            @click="toggleSubmenu('usuarios')" 
            class="submenu-toggle"
            :class="{ 'active': isSubmenuActive('usuarios') }"
          >
            <div class="toggle-content">
              <span class="icon">
                <font-awesome-icon icon="fa-user" />
              </span>
              <span class="text">Gestión de Usuarios</span>
            </div>
            <span class="toggle-arrow">
              <font-awesome-icon :icon="submenuStates.usuarios ? 'fa-chevron-down' : 'fa-chevron-right'" />
            </span>
          </div>
          
          <ul class="submenu" :class="{ 'open': submenuStates.usuarios }">
            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/usuarios/profesores" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/usuarios/profesores') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-user-tie" />
                </span>
                <span class="submenu-text">Profesores</span>
              </router-link>
            </li>
            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/usuarios/estudiantes" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/usuarios/estudiantes') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-graduation-cap" />
                </span>
                <span class="submenu-text">Estudiantes</span>
              </router-link>
            </li>
            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/usuarios/padres" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/usuarios/padres') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-users" />
                </span>
                <span class="submenu-text">Padres</span>
              </router-link>
            </li>
          </ul>
        </li>
        
        <!-- Años Lectivos -->
        <li class="menu-item">
          <div 
            @click="toggleSubmenu('anios')" 
            class="submenu-toggle"
            :class="{ 'active': isSubmenuActive('anios') }"
          >
            <div class="toggle-content">
              <span class="icon">
                <font-awesome-icon icon="fa-calendar" />
              </span>
              <span class="text">Años Lectivos</span>
            </div>
            <span class="toggle-arrow">
              <font-awesome-icon :icon="submenuStates.anios ? 'fa-chevron-down' : 'fa-chevron-right'" />
            </span>
          </div>
          
          <ul class="submenu" :class="{ 'open': submenuStates.anios }">
            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/anios/ver" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/anios/ver') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-eye" />
                </span>
                <span class="submenu-text">Ver Años</span>
              </router-link>
            </li>

            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/anios/promocionar" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/anios/promocionar') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-arrow-up" />
                </span>
                <span class="submenu-text">Promocionar Estudiantes</span>
              </router-link>
            </li>
          </ul>
        </li>
        <!-- Horarios -->
        <li class="menu-item">
          <div 
            @click="toggleSubmenu('horarios')" 
            class="submenu-toggle"
            :class="{ 'active': isSubmenuActive('horarios') }"
          >
            <div class="toggle-content">
              <span class="icon">
                <font-awesome-icon icon="fa-clock" />
              </span>
              <span class="text">Horarios</span>
            </div>
            <span class="toggle-arrow">
              <font-awesome-icon :icon="submenuStates.horarios ? 'fa-chevron-down' : 'fa-chevron-right'" />
            </span>
          </div>
          
          <ul class="submenu" :class="{ 'open': submenuStates.horarios }">
            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/horarios/ver" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/horarios/ver') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-eye" />
                </span>
                <span class="submenu-text">Ver Horarios</span>
              </router-link>
            </li>
            <li class="submenu-item">
              <router-link 
                to="/dashboard/direccion/horarios/gestion" 
                class="submenu-link"
                :class="{ 'active': isActive('/dashboard/direccion/horarios/gestion') }"
              >
                <span class="submenu-icon">
                  <font-awesome-icon icon="fa-cog" />
                </span>
                <span class="submenu-text">Gestión de Horarios</span>
              </router-link>
            </li>
          </ul>
        </li>
        
        <!-- Secciones -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/secciones" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/secciones') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-table-cells-large" />
            </span>
            <span class="text">Secciones</span>
          </router-link>
        </li>
        
        <!-- Materias -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/materias" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/materias') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-book-open" />
            </span>
            <span class="text">Materias</span>
          </router-link>
        </li>

        <!-- Horarios -->

        
        <!-- Documentos -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/documentos" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/documentos') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-folder" />
            </span>
            <span class="text">Documentos</span>
          </router-link>
        </li>
        
        <!-- Avisos -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/avisos" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/avisos') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-bullhorn" />
            </span>
            <span class="text">Avisos</span>
          </router-link>
        </li>
        
        <!-- Reportes -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/reportes" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/reportes') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-chart-bar" />
            </span>
            <span class="text">Reportes</span>
          </router-link>
        </li>
        
        <!-- Calendario -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/calendario" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/calendario') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-calendar-alt" />
            </span>
            <span class="text">Calendario</span>
          </router-link>
        </li>
        
        <!-- Notificaciones con contador -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/notificaciones" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/notificaciones') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-bell" />
              <span v-if="cantidadNoLeidas > 0" class="notification-badge">{{ cantidadNoLeidas }}</span>
            </span>
            <span class="text">Notificaciones</span>
          </router-link>
        </li>
        
        <!-- Perfil -->
        <li class="menu-item">
          <router-link 
            to="/dashboard/direccion/perfil" 
            class="menu-link"
            :class="{ 'active': isActive('/dashboard/direccion/perfil') }"
          >
            <span class="icon">
              <font-awesome-icon icon="fa-user" />
            </span>
            <span class="text">Perfil</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <font-awesome-icon icon="fa-user-circle" />
        </div>
        <div class="user-details">
          <p class="user-name">{{ nombreUsuario }}</p>
          <p class="user-role">Dirección</p>
        </div>
      </div>
      <button @click="cerrarSesion" class="logout-button">
        <font-awesome-icon icon="fa-sign-out-alt" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>

  <!-- Slot para el contenido principal -->
  <div class="main-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificacionesStore } from '@/stores/notificacionesStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificacionesStore = useNotificacionesStore();

const nombreUsuario = computed(() => authStore.userName);

const submenuStates = ref({
  usuarios: false,
  anios: false,
  horarios: false
});

const cantidadNoLeidas = computed(() => notificacionesStore.cantidadNoLeidas);

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};
const isSubmenuActive = (submenu: string) => {
  if (submenu === 'usuarios') {
    return route.path.includes('/dashboard/direccion/usuarios/');
  } else if (submenu === 'anios') {
    return route.path.includes('/dashboard/direccion/anios/');
  } else if (submenu === 'horarios') {
    return route.path.includes('/dashboard/direccion/horarios/');
  }
  return false;
};

const toggleSubmenu = (submenu: string) => {
  submenuStates.value[submenu as keyof typeof submenuStates.value] = 
    !submenuStates.value[submenu as keyof typeof submenuStates.value];
};

const cerrarSesion = async () => {
  await authStore.logout();
  router.replace({ name: 'login' });
};
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/sidebar.css';
</style>