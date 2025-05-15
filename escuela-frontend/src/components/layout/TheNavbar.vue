<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" />
      </router-link>

      <!-- Desktop Links -->
      <div class="links">
        <div class="nav-items">
          <a href="#nuestra-escuela" class="nav-link" :class="{ 'active': activeSection === 'nuestra-escuela' }">Nuestra Escuela</a>
          <a href="#servicios" class="nav-link" :class="{ 'active': activeSection === 'servicios' }">Servicios</a>
          <a href="#noticias" class="nav-link" :class="{ 'active': activeSection === 'noticias' }">Noticias</a>
          <router-link to="/junta-patronato" class="nav-link" :class="{ 'active': $route.path === '/junta-patronato' }">Junta y Patronato</router-link>
          <a href="#contacto" class="nav-link" :class="{ 'active': activeSection === 'contacto' }">Contacto</a>
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
          <a 
            href="#nuestra-escuela" 
            class="mobile-nav-link" 
            :class="{ 'active': activeSection === 'nuestra-escuela' }" 
            @click="toggleMobileMenu"
          >Nuestra Escuela</a>
          <a 
            href="#servicios" 
            class="mobile-nav-link" 
            :class="{ 'active': activeSection === 'servicios' }" 
            @click="toggleMobileMenu"
          >Servicios</a>
          <a 
            href="#noticias" 
            class="mobile-nav-link" 
            :class="{ 'active': activeSection === 'noticias' }" 
            @click="toggleMobileMenu"
          >Noticias</a>
          <router-link 
            to="/junta-patronato" 
            class="mobile-nav-link" 
            :class="{ 'active': $route.path === '/junta-patronato' }" 
            @click="toggleMobileMenu"
          >Junta y Patronato</router-link>
          <a 
            href="#contacto" 
            class="mobile-nav-link" 
            :class="{ 'active': activeSection === 'contacto' }" 
            @click="toggleMobileMenu"
          >Contacto</a>
          <router-link 
            to="/login" 
            class="mobile-nav-link portal-mobile-link" 
            @click="toggleMobileMenu"
          >Acceder al Portal</router-link>
        </div>

        <!-- Se eliminaron los botones de autenticación -->
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)
const activeSection = ref('')
const isScrolled = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value

  // Prevent scrolling when menu is open
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Función para detectar qué sección está visible en la pantalla
function checkActiveSection() {
  const sections = [
    'nuestra-escuela',
    'servicios',
    'noticias',
    'contacto'
  ]
  
  // Detectar si se ha hecho scroll
  isScrolled.value = window.scrollY > 50
  
  // Solo verificar secciones si estamos en la página principal
  if (route.path === '/') {
    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        // Si la sección está visible en la pantalla
        if (rect.top <= 150 && rect.bottom >= 150) {
          activeSection.value = section
          return
        }
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkActiveSection)
  checkActiveSection() // Verificar al cargar la página
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkActiveSection)
})
</script>

<style scoped>
@import '@/assets/styles/landing/navbar.css';
</style>
