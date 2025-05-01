<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" class="login-logo" />
          <h1>Iniciar Sesión</h1>
          <p class="login-subtitle">Ingrese sus credenciales para acceder al sistema</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <div class="input-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="ejemplo@correo.com" 
                required 
                class="form-input"
              />
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <div class="password-label-container">
              <label for="password">Contraseña</label>
              <a href="#" class="forgot-password">¿Olvidó su contraseña?</a>
            </div>
            <div class="input-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="••••••••" 
                required 
                class="form-input"
              />
              <button 
                type="button" 
                @click="togglePassword" 
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-group remember-me">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkmark"></span>
              Recordarme
            </label>
          </div>
          
          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>
        
        <div class="login-footer">
          <p>¿Es padre de familia y no tiene una cuenta? <router-link to="/crear-cuenta" class="register-link">Registrarse</router-link></p>
          <p class="mt-2">Si es docente y no tiene acceso, por favor contacte a la administración de la escuela</p>
        </div>
      </div>
      
      <div class="login-image-container">
        <div class="login-image-overlay"></div>
        <div class="login-image-content">
          <h2>Bienvenido a la Escuela Manuela Santamaría</h2>
          <p>Acceda a nuestro sistema para consultar información importante sobre el progreso académico de sus hijos.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/auth/useLogin'

// Usar el composable de login
const {
  email,
  password,
  rememberMe,
  showPassword,
  isLoading,
  errors,
  togglePassword,
  handleLogin
} = useLogin()
</script>

<style scoped>
@import '@/assets/styles/auth/login.css';
</style>
