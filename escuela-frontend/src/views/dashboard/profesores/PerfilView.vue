<template>
  <div class="perfil-view">
    <header class="perfil-header">
      <h1>Mi Perfil</h1>
      <p class="current-date">{{ formattedDate }}</p>
    </header>

    <div class="perfil-sections">
      <!-- Sección de información personal -->
      <section class="perfil-section info-personal">
        <h2>Información Personal</h2>
        <div class="info-container">
          <div class="info-item">
            <label>Nombre completo</label>
            <p>{{ profesor.nombreCompleto }}</p>
          </div>
          <div class="info-item">
            <label>Correo electrónico</label>
            <p>{{ profesor.email }}</p>
          </div>

          <div class="info-item">
            <label>Secciones asignadas</label>
            <ul class="lista-items">
              <li v-for="(seccion, index) in profesor.secciones" :key="index">
                {{ seccion }}
              </li>
            </ul>
          </div>

          <div class="info-item">
            <label>Materias que imparte</label>
            <ul class="lista-items">
              <li v-for="(materia, index) in profesor.materias" :key="index">
                {{ materia }}
              </li>
            </ul>
          </div>
        </div>

        <div class="security-options">
          <h3>Opciones de seguridad</h3>
          <router-link to="/cambiar-contrasena" class="security-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="button-icon"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Cambiar contraseña
          </router-link>
        </div>
      </section>
    </div>

    <!-- Sección de horarios de atención -->
    <section class="perfil-section horarios-atencion">
      <h2>Horarios de Atención a Padres</h2>
      <p class="section-description">
        Configure sus horarios disponibles para atender consultas de padres de familia.
      </p>

      <form @submit.prevent="guardarHorarios" class="form-horarios">
        <div class="horarios-grid">
          <div v-for="(dia, index) in horarios" :key="index" class="horario-card">
            <div class="horario-card-header" :class="{ 'inactive': dia.sinAtencion }">
              <div class="dia-nombre">{{ dia.nombre }}</div>
              <div class="toggle-container">
                <label class="toggle-switch">
                  <input type="checkbox" :checked="!dia.sinAtencion" @change="dia.sinAtencion = !dia.sinAtencion" />
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{ dia.sinAtencion ? 'Sin atención' : 'Disponible' }}</span>
              </div>
            </div>

            <div class="horario-card-body" :class="{ 'disabled': dia.sinAtencion }">
              <div class="tiempo-row">
                <div class="tiempo-label">Desde</div>
                <div class="tiempo-input-wrapper">
                  <div class="tiempo-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tiempo-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <input 
                      type="time" 
                      v-model="dia.horaInicio" 
                      :disabled="dia.sinAtencion" 
                    />
                  </div>
                </div>
              </div>
              
              <div class="tiempo-row">
                <div class="tiempo-label">Hasta</div>
                <div class="tiempo-input-wrapper">
                  <div class="tiempo-input">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tiempo-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <input 
                      type="time" 
                      v-model="dia.horaFin" 
                      :disabled="dia.sinAtencion" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="horarios-footer">
          <div class="horarios-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="info-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Los horarios configurados serán visibles para los padres de familia en el portal.</span>
          </div>
          
          <div v-if="horarioMessage" :class="['message', horarioMessage.type]">
            {{ horarioMessage.text }}
          </div>
          
          <button type="submit" class="guardar-horarios" :disabled="isHorarioLoading">
            <svg v-if="!isHorarioLoading" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span v-if="!isHorarioLoading">Guardar horarios</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePerfil } from '@/composables/dashboards/profesores/usePerfil';

const {
  formattedDate,
  profesor,
  horarios,
  isHorarioLoading,
  horarioMessage,
  guardarHorarios
} = usePerfil();
</script>

<style scoped>
@import "@/assets/styles/dashboards/profesores/perfil.css";
</style>
