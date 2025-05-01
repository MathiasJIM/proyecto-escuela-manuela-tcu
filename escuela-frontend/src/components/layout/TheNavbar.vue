<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" />
      </router-link>

      <!-- Desktop Links -->
      <div class="links">
        <div class="auth-buttons">
          <router-link to="/crear-cuenta" class="btn-register">Crear Cuenta</router-link>
          <router-link to="/login" class="btn-login">Iniciar Sesión</router-link>
        </div>
        <div class="nav-items">
          <a href="#nuestra-escuela" class="nav-link">Nuestra Escuela</a>
          <a href="#servicios" class="nav-link">Servicios</a>
          <a href="#noticias" class="nav-link">Noticias</a>
          <a href="#contacto" class="nav-link">Contacto</a>
          <router-link to="/login" class="nav-link portal-link">Acceder al Portal <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="portal-icon"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg></router-link>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <font-awesome-icon icon="fa-bars" class="menu-icon" />
        <span>MENU</span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-header">
        <router-link to="/" class="logo">
          <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" />
        </router-link>
        <button class="close-button" @click="toggleMobileMenu" aria-label="Close Menu">
          <font-awesome-icon icon="fa-xmark" class="close-icon" />
          <span class="close-text">CERRAR</span>
        </button>
      </div>

      <div class="mobile-menu-content">
        <div class="mobile-nav-items">
          <a href="#nuestra-escuela" class="mobile-nav-link" @click="toggleMobileMenu"
            >Nuestra Escuela</a
          >
          <a href="#servicios" class="mobile-nav-link" @click="toggleMobileMenu">Servicios</a>
          <a href="#noticias" class="mobile-nav-link" @click="toggleMobileMenu">Noticias</a>
          <a href="#contacto" class="mobile-nav-link" @click="toggleMobileMenu">Contacto</a>
          <router-link to="/login" class="mobile-nav-link" @click="toggleMobileMenu"
            >Acceder al Portal</router-link
          >
        </div>

        <div class="mobile-auth-buttons">
          <router-link to="/login" class="btn-login">Iniciar Sesión</router-link>
          <router-link to="/crear-cuenta" class="btn-register">Crear Cuenta</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value

  // Prevent scrolling when menu is open
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
    console.log('Menu opened', mobileMenuOpen.value)
  } else {
    document.body.style.overflow = ''
    console.log('Menu closed', mobileMenuOpen.value)
  }
}
</script>

<style scoped>
@import '@/assets/styles/landing/navbar.css';
</style>
