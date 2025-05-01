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
          <p>Si no tiene acceso, por favor contacte a la administración de la escuela</p>
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
import { ref, reactive } from 'vue'
// El router se utilizará cuando implementemos la redirección después del login

// Estado del formulario
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

// Función para mostrar/ocultar contraseña
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Función para validar el formulario
function validateForm() {
  let isValid = true
  
  // Validar email
  if (!email.value) {
    errors.email = 'El correo electrónico es requerido'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'El correo electrónico no es válido'
    isValid = false
  } else {
    errors.email = ''
  }
  
  // Validar contraseña
  if (!password.value) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  } else {
    errors.password = ''
  }
  
  return isValid
}

// Función para manejar el inicio de sesión
async function handleLogin() {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // Aquí iría la lógica de autenticación
    console.log('Iniciando sesión con:', { email: email.value, password: password.value, rememberMe: rememberMe.value })
    
    // Simulamos una respuesta del servidor
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirigir al usuario después del inicio de sesión exitoso
    // Implementar redirección cuando tengamos la ruta del dashboard
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-off-white);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  background-color: var(--bg-light);
}

.login-card {
  flex: 1;
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-logo {
  height: 100px;
  margin-bottom: var(--spacing-md);
}

.login-header h1 {
  color: var(--primary-color);
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-xs);
}

.login-subtitle {
  color: var(--text-medium);
  font-size: var(--font-size-base);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.password-label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  font-size: var(--font-size-sm);
  color: var(--secondary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.forgot-password:hover {
  color: var(--secondary-dark);
  text-decoration: underline;
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

.remember-me {
  display: flex;
  align-items: center;
  margin-top: var(--spacing-xs);
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-medium);
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  display: inline-block;
  height: 18px;
  width: 18px;
  margin-right: 8px;
  background-color: var(--bg-light);
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--secondary-color);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-button {
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

.login-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
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

.error-message {
  color: var(--accent-color);
  font-size: var(--font-size-xs);
  margin-top: 4px;
}

.login-footer {
  margin-top: auto;
  text-align: center;
  padding-top: var(--spacing-xl);
  color: var(--text-medium);
  font-size: var(--font-size-sm);
}

.signup-link {
  color: var(--secondary-color);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.signup-link:hover {
  color: var(--secondary-dark);
  text-decoration: underline;
}

.login-image-container {
  flex: 1;
  position: relative;
  background-image: url('@/assets/images/imagen-de-la-escuela.png');
  background-size: cover;
  background-position: center;
  display: none;
}

.login-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(24, 38, 69, 0.85), rgba(24, 38, 69, 0.95));
}

.login-image-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: var(--spacing-2xl);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-image-content h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-family-heading);
}

.login-image-content p {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  opacity: 0.9;
}

/* Media Queries */
@media (min-width: 768px) {
  .login-image-container {
    display: block;
  }
}

@media (max-width: 767px) {
  .login-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .login-card {
    padding: var(--spacing-xl) var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .login-logo {
    height: 80px;
  }
  
  .login-header h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
