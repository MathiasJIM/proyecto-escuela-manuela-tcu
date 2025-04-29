<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" />
      </router-link>

      <!-- Desktop Links -->
      <div class="links">
        <div class="auth-buttons">
          <a href="/crear-cuenta" class="btn-crear">Crear Cuenta</a>
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
          <a href="/crear-cuenta" class="btn-crear">Crear Cuenta</a>
          <router-link to="/login" class="btn-login">Iniciar Sesión</router-link>
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
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.9;
}

.logo img {
  height: 100px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
}

.links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 8px;
  gap: 12px;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 60px;
  margin: 0;
}

.nav-link {
  color: var(--text-medium);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  white-space: nowrap;
  padding: 6px 0;
  position: relative;
  transition: all var(--transition-fast);
  letter-spacing: 0.2px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform: scaleX(0);
  transition: transform var(--transition-fast);
  border-radius: 2px;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.router-link-active {
  color: var(--primary-color);
}

.router-link-active::after {
  transform: scaleX(1);
}

.portal-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

.portal-icon {
  transition: transform var(--transition-fast);
}

.portal-link:hover .portal-icon {
  transform: translateX(3px);
}

.auth-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
}

.btn-crear {
  color: var(--accent-color);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  padding: 8px 0;
  letter-spacing: 0.2px;
}

.btn-crear:hover {
  color: var(--accent-dark);
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 10px 15px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  letter-spacing: 0.2px;
  box-shadow: var(--shadow-sm);
  font-family: var(--font-family-heading);
}

.btn-login:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-login:active {
  transform: translateY(0);
}

@media (max-width: 1200px) {
  .nav-items {
    gap: 48px;
  }
}

@media (max-width: 1024px) {
  .nav-items {
    gap: 36px;
  }

  .navbar-container {
    height: 100px;
  }

  .logo img {
    height: 80px;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    height: 80px;
    padding: 0 16px;
    position: relative;
  }

  .logo img {
    height: 60px;
  }

  .nav-items,
  .auth-buttons {
    display: none;
  }

  .mobile-menu-btn {
    display: flex !important;
  }
}
/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.5px;
  font-family: var(--font-family-heading);
}

.menu-icon {
  font-size: 18px;
  color: var(--primary-color);
}

.menu-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.close-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.close-icon {
  font-size: 16px;
  color: var(--primary-color);
  margin-right: 8px;
}

.close-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
  letter-spacing: 0.5px;
  font-family: var(--font-family-heading);
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  height: 100%;
}

.mobile-nav-items {
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
}

.mobile-nav-link {
  color: var(--text-dark);
  text-decoration: none;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  padding: 12px 0;
  border-bottom: 1px solid #eaeaea;
  transition: all var(--transition-fast);
  font-family: var(--font-family-heading);
}

.mobile-nav-link::after {
  content: '→';
  font-size: var(--font-size-lg);
  color: var(--primary-color);
}

.mobile-secondary-links {
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
}

.mobile-secondary-link {
  color: #535353;
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  padding: 12px 0;
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
  padding-top: 24px;
}

.mobile-auth-buttons .btn-crear {
  text-align: center;
}

.mobile-auth-buttons .btn-login {
  width: 100%;
  padding: 12px;
  text-align: center;
}
</style>
