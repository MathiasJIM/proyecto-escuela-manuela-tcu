<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <img src="@/assets/images/logo-escuela.webp" alt="Logo Escuela" class="register-logo" />
          <h1>Crear Cuenta de Padre/Madre</h1>
          <p class="register-subtitle">Complete el formulario para registrarse en el portal de padres</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="fullName">Nombre Completo</label>
            <div class="input-container">
              <font-awesome-icon :icon="['far', 'user']" class="input-icon" />
              <input 
                type="text" 
                id="fullName" 
                v-model="fullName" 
                placeholder="Ingrese su nombre completo" 
                required 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <div class="input-container">
              <font-awesome-icon :icon="['far', 'envelope']" class="input-icon" />
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="ejemplo@correo.com" 
                required 
                class="form-input"
              />
            </div>
          </div>
          

          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-container">
              <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="••••••••" 
                required 
                class="form-input"
                @input="checkPasswordStrength"
                autocomplete="new-password"
              />
              <button 
                type="button" 
                @click="togglePassword" 
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <font-awesome-icon v-if="!showPassword" :icon="['far', 'eye']" />
                <font-awesome-icon v-else :icon="['far', 'eye-slash']" />
              </button>
            </div>
            <div v-if="password" class="password-strength-container">
              <div class="password-strength-label">
                <span>Seguridad:</span>
                <span :class="`strength-text strength-${passwordStrength}`">{{ passwordStrengthText }}</span>
              </div>
              <div class="password-strength-meter">
                <div 
                  class="password-strength-progress" 
                  :class="`strength-${passwordStrength}`"
                  :style="{ width: passwordStrengthPercentage + '%' }"
                ></div>
              </div>
              <ul class="password-requirements">
                <li :class="{ 'requirement-met': hasMinLength }">Mínimo 8 caracteres</li>
                <li :class="{ 'requirement-met': hasUpperCase }">Al menos una mayúscula</li>
                <li :class="{ 'requirement-met': hasLowerCase }">Al menos una minúscula</li>
                <li :class="{ 'requirement-met': hasNumber }">Al menos un número</li>
              </ul>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <div class="input-container">
              <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="••••••••" 
                required 
                class="form-input"
                autocomplete="new-password"
              />
              <button 
                type="button" 
                @click="toggleConfirmPassword" 
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <font-awesome-icon v-if="!showConfirmPassword" :icon="['far', 'eye']" />
                <font-awesome-icon v-else :icon="['far', 'eye-slash']" />
              </button>
            </div>
            <div v-if="confirmPassword && password !== confirmPassword" class="password-mismatch">
              Las contraseñas no coinciden
            </div>
          </div>
          
          <button type="submit" class="register-button" :disabled="isLoading">
            <span v-if="!isLoading">Crear Cuenta</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>
        
        <div class="register-footer">
          <p>¿Ya tiene una cuenta? <router-link to="/login" class="login-link">Iniciar Sesión</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegister } from '@/composables/auth/useRegister'

// Usar el composable de registro
const {
  fullName,
  email,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  isLoading,
  passwordStrength,
  passwordStrengthText,
  passwordStrengthPercentage,
  hasMinLength,
  hasUpperCase,
  hasLowerCase,
  hasNumber,
  togglePassword,
  toggleConfirmPassword,
  checkPasswordStrength,
  handleRegister
} = useRegister()
</script>

<style scoped>
@import '@/assets/styles/auth/register.css';
</style>