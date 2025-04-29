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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
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
          </div>
          

          
          <div class="form-group">
            <label for="password">Contraseña</label>
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
                @input="checkPasswordStrength"
                autocomplete="new-password"
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
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
import { ref } from 'vue'

// Estado del formulario
const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// Variables para la validación de contraseña
const passwordStrength = ref(0)
const passwordStrengthText = ref('')
const passwordStrengthPercentage = ref(0)
const hasMinLength = ref(false)
const hasUpperCase = ref(false)
const hasLowerCase = ref(false)
const hasNumber = ref(false)

// Función para mostrar/ocultar contraseña
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Función para mostrar/ocultar confirmación de contraseña
function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Función para verificar la fortaleza de la contraseña
function checkPasswordStrength() {
  const pwd = password.value
  
  // Verificar requisitos
  hasMinLength.value = pwd.length >= 8
  hasUpperCase.value = /[A-Z]/.test(pwd)
  hasLowerCase.value = /[a-z]/.test(pwd)
  hasNumber.value = /[0-9]/.test(pwd)
  
  // Calcular puntuación
  let score = 0
  if (hasMinLength.value) score += 1
  if (hasUpperCase.value) score += 1
  if (hasLowerCase.value) score += 1
  if (hasNumber.value) score += 1
  
  // Asignar nivel de fortaleza
  passwordStrength.value = score
  
  // Textos según nivel
  const strengthTexts = ['Muy débil', 'Débil', 'Moderada', 'Fuerte']
  passwordStrengthText.value = strengthTexts[score - 1] || ''
  
  // Porcentaje para la barra de progreso
  passwordStrengthPercentage.value = (score / 4) * 100
}

// Función para manejar el registro
async function handleRegister() {
  // Validar que las contraseñas coincidan
  if (password.value !== confirmPassword.value) {
    return
  }
  
  // Validar fortaleza de contraseña
  if (passwordStrength.value < 3) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Aquí iría la lógica de registro
    console.log('Registrando padre/madre:', { 
      fullName: fullName.value,
      email: email.value,
      password: password.value
    })
    
    // Simulamos una respuesta del servidor
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirigir al usuario después del registro exitoso
    // Implementar redirección cuando tengamos la ruta del dashboard
    
  } catch (error) {
    console.error('Error al registrar usuario:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-off-white);
  padding: 20px;
}

.register-container {
  display: flex;
  width: 100%;
  max-width: 600px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  background-color: var(--bg-light);
}

.register-card {
  flex: 1;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.register-logo {
  height: 80px;
  margin-bottom: var(--spacing-md);
}

.register-header h1 {
  color: var(--primary-color);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xs);
}

.register-subtitle {
  color: var(--text-medium);
  font-size: var(--font-size-base);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-medium);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--text-light);
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  color: var(--text-dark);
  background-color: var(--bg-light);
}

.form-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.form-input::placeholder {
  color: #cbd5e0;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.password-strength-container {
  margin-top: 8px;
}

.password-strength-label {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  margin-bottom: 4px;
}

.strength-text {
  font-weight: var(--font-weight-semibold);
}

.strength-1 {
  color: #e53e3e;
}

.strength-2 {
  color: #dd6b20;
}

.strength-3 {
  color: #38a169;
}

.strength-4 {
  color: #2b6cb0;
}

.password-strength-meter {
  height: 4px;
  background-color: #edf2f7;
  border-radius: 2px;
  margin-bottom: 8px;
}

.password-strength-progress {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.password-requirements {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.password-requirements li {
  position: relative;
  padding-left: 16px;
}

.password-requirements li:before {
  content: '•';
  position: absolute;
  left: 4px;
  color: var(--text-light);
}

.requirement-met {
  color: var(--secondary-color);
}

.requirement-met:before {
  content: '✓' !important;
  color: var(--secondary-color) !important;
}

.password-mismatch {
  color: var(--accent-color);
  font-size: var(--font-size-xs);
  margin-top: 4px;
}

.register-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: 12px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: var(--spacing-md);
  position: relative;
  font-family: var(--font-family-heading);
}

.register-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.register-button:active {
  transform: translateY(0);
}

.register-button:disabled {
  background-color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.register-footer {
  margin-top: auto;
  text-align: center;
  padding-top: var(--spacing-lg);
  color: var(--text-medium);
  font-size: var(--font-size-sm);
}

.login-link {
  color: var(--secondary-color);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.login-link:hover {
  color: var(--secondary-dark);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .register-logo {
    height: 60px;
  }
  
  .register-header h1 {
    font-size: var(--font-size-xl);
  }
}
</style>
