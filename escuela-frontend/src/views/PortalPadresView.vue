<template>
  <div class="portal-padres">
    <div class="portal-container">
      <h1>Portal de Padres</h1>
      <div class="login-form">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit" class="btn-login">Ingresar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Aquí iría la lógica de autenticación
  console.log('Login attempt:', { email: email.value, password: password.value })
}
</script>

<style scoped>
.portal-padres {
  padding: 120px 24px;
  min-height: 100vh;
  background-color: #f8f9fa;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.portal-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #3a4776;
  margin-bottom: 2rem;
}

.login-form {
  padding: 2rem;
}

h2 {
  color: #535353;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #535353;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: #3a4776;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-login:hover {
  background-color: #182645;
}

@media (max-width: 768px) {
  .portal-padres {
    padding: 100px 1rem;
  }
}
</style>
