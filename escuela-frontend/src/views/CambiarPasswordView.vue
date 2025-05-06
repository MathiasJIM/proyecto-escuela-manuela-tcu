<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" class="auth-logo" />
          <h1>Cambiar Contraseña</h1>
          <p class="auth-subtitle">Actualice su contraseña para mantener su cuenta segura</p>
        </div>
        
        <form @submit.prevent="actualizarPassword" class="auth-form">
          <div class="form-group">
            <label for="currentPassword">Contraseña actual</label>
            <div class="input-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                :type="showCurrentPassword ? 'text' : 'password'" 
                id="currentPassword" 
                v-model="passwordForm.currentPassword" 
                placeholder="••••••••" 
                required 
                class="form-input"
              />
              <button 
                type="button" 
                @click="toggleCurrentPassword" 
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</span>
          </div>
          
          <div class="form-group">
            <label for="newPassword">Nueva contraseña</label>
            <div class="input-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                :type="showNewPassword ? 'text' : 'password'" 
                id="newPassword" 
                v-model="passwordForm.newPassword" 
                placeholder="••••••••" 
                required 
                class="form-input"
              />
              <button 
                type="button" 
                @click="toggleNewPassword" 
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar nueva contraseña</label>
            <div class="input-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="passwordForm.confirmPassword" 
                placeholder="••••••••" 
                required 
                class="form-input"
              />
              <button 
                type="button" 
                @click="toggleConfirmPassword" 
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>
          
          <div v-if="passwordMessage" :class="['message', passwordMessage.type]">
            {{ passwordMessage.text }}
          </div>
          
          <div class="password-requirements">
            <h3>Requisitos de seguridad:</h3>
            <ul>
              <li :class="{ 'requirement-met': passwordForm.newPassword.length >= 8 }">
                <svg v-if="passwordForm.newPassword.length >= 8" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="requirement-icon success">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="requirement-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Mínimo 8 caracteres
              </li>
              <li :class="{ 'requirement-met': /[A-Z]/.test(passwordForm.newPassword) }">
                <svg v-if="/[A-Z]/.test(passwordForm.newPassword)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="requirement-icon success">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="requirement-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Al menos una mayúscula
              </li>
              <li :class="{ 'requirement-met': /[0-9]/.test(passwordForm.newPassword) }">
                <svg v-if="/[0-9]/.test(passwordForm.newPassword)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="requirement-icon success">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="requirement-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Al menos un número
              </li>
            </ul>
          </div>
          
          <div class="button-group">
            <router-link to="/dashboard/profesores/perfil" class="cancel-button">
              Volver al Perfil
            </router-link>
            <button type="submit" class="auth-button" :disabled="isPasswordLoading">
              <span v-if="!isPasswordLoading">Actualizar contraseña</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Si tiene problemas para cambiar su contraseña, contacte al administrador del sistema</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChangePassword } from '@/composables/auth/useChangePassword'

// Usar el composable de cambio de contraseña
const {
  passwordForm,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  isPasswordLoading,
  errors,
  passwordMessage,
  toggleCurrentPassword,
  toggleNewPassword,
  toggleConfirmPassword,
  actualizarPassword
} = useChangePassword()
</script>

<style scoped>
@import "@/assets/styles/auth/change-password.css";
</style>
