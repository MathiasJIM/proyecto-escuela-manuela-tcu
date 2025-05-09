<template>
  <div class="citas-view">
    <!-- Encabezado de la página -->
    <header class="dashboard-header">
      <h1>Gestión de Citas con Padres</h1>
      <p class="current-date">{{ formattedCurrentDate }}</p>
    </header>

    <!-- Tarjetas de acceso rápido -->
    <div class="dashboard-cards">
      <router-link to="/dashboard/profesores/calendario" class="dashboard-card">
        <div class="card-icon calendar">
          <font-awesome-icon icon="calendar-alt" size="lg" />
        </div>
        <div class="card-content">
          <h3>Calendario</h3>
          <p>Ver eventos y citas programadas</p>
        </div>
      </router-link>

      <div class="dashboard-card" @click="verPendientes">
        <div class="card-icon pending">
          <font-awesome-icon icon="clock" size="lg" />
        </div>
        <div class="card-content">
          <h3>Solicitudes Pendientes</h3>
          <p>{{ citasPendientes.length }} solicitudes por revisar</p>
        </div>
      </div>

      <router-link to="/dashboard/profesores/calendario" class="dashboard-card">
        <div class="card-icon add">
          <font-awesome-icon icon="calendar-plus" size="lg" />
        </div>
        <div class="card-content">
          <h3>Agregar Cita</h3>
          <p>Programar una nueva cita</p>
        </div>
      </router-link>
    </div>

    <!-- Solicitudes Pendientes -->
    <div class="card-section">
      <div class="section-header" @click="togglePendientesSection">
        <div class="header-content">
          <h2>
            <font-awesome-icon icon="fa-clock" size="lg" />
            Solicitudes Pendientes
          </h2>
          <p class="section-description">Solicitudes de citas que requieren su aprobación</p>
        </div>
        <button class="toggle-button" :class="{ collapsed: !showPendientesSection }">
          <font-awesome-icon icon="chevron-down" />
        </button>
      </div>

      <div class="section-content" v-show="showPendientesSection">
        <div v-if="citasPendientes.length === 0" class="empty-state">
          <font-awesome-icon icon="inbox" size="2x" />
          <p>No hay solicitudes pendientes en este momento.</p>
        </div>
        <div v-else class="solicitudes-pendientes-container">
          <div class="solicitudes-pendientes">
            <div v-for="cita in citasPendientes" :key="cita.id" class="solicitud-card">
              <div class="solicitud-top">
                <div class="solicitud-header">
                  <h3>{{ cita.estudiante }}</h3>
                </div>

                <div class="solicitud-info">
                  <div class="info-row">
                    <font-awesome-icon icon="user" />
                    <span>{{ cita.padre }}</span>
                  </div>

                  <div class="info-row-container">
                    <div class="info-row date">
                      <font-awesome-icon icon="calendar-day" />
                      <span>{{ formatDate(cita.fecha) }}</span>
                    </div>

                    <div class="info-row time">
                      <font-awesome-icon icon="clock" />
                      <span>{{ cita.hora }}</span>
                    </div>
                  </div>

                  <div class="info-row motivo-row">
                    <div class="motivo-label">
                      <font-awesome-icon icon="comment" />
                      <span>Motivo:</span>
                    </div>
                    <div class="motivo-container">
                      <span>{{ cita.motivo }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="solicitud-actions">
                <button @click="aceptarCita(cita.id)" class="btn-action accept">
                  <font-awesome-icon icon="check" />
                  Aceptar
                </button>
                <button @click="rechazarCita(cita.id)" class="btn-action reject">
                  <font-awesome-icon icon="times" />
                  Rechazar
                </button>
                <button @click="responderCita(cita.id)" class="btn-action reply">
                  <font-awesome-icon icon="reply" />
                  Responder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Citas Confirmadas Próximas -->
    <div class="card-section">
      <div class="section-header" @click="toggleConfirmadasSection">
        <div class="header-content">
          <h2>
            <font-awesome-icon icon="calendar-check" />
            Citas Confirmadas Próximas
          </h2>
          <p class="section-description">Citas programadas para los próximos días</p>
        </div>
        <button class="toggle-button" :class="{ collapsed: !showConfirmadasSection }">
          <font-awesome-icon icon="chevron-down" />
        </button>
      </div>

      <div class="section-content" v-show="showConfirmadasSection">
        <div v-if="citasConfirmadas.length === 0" class="empty-state">
          <font-awesome-icon icon="calendar-times" size="2x" />
          <p>No hay citas confirmadas próximas.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estudiante</th>
                <th>Padre/Madre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cita in citasConfirmadas" :key="cita.id">
                <td>{{ formatDate(cita.fecha) }}</td>
                <td>{{ cita.hora }}</td>
                <td>{{ cita.estudiante }}</td>
                <td>{{ cita.padre }}</td>
                <td>
                  <button @click="verDetallesCita(cita.id)" class="btn-action details">
                    <font-awesome-icon icon="eye" />
                    Ver detalles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Historial de Citas -->
    <div class="card-section">
      <div class="section-header" @click="toggleHistorialSection">
        <div class="header-content">
          <h2>
            <font-awesome-icon icon="history" />
            Historial de Citas
          </h2>
          <p class="section-description">Registro de citas pasadas</p>
        </div>
        <button class="toggle-button" :class="{ collapsed: !showHistorialSection }">
          <font-awesome-icon icon="chevron-down" />
        </button>
      </div>

      <div class="section-content" v-show="showHistorialSection">
        <div v-if="citasHistorial.length === 0" class="empty-state">
          <font-awesome-icon icon="folder-open" size="2x" />
          <p>No hay historial de citas anteriores.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estudiante</th>
                <th>Padre/Madre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cita in citasHistorial" :key="cita.id">
                <td>{{ formatDate(cita.fecha) }}</td>
                <td>{{ cita.estudiante }}</td>
                <td>{{ cita.padre }}</td>
                <td>
                  <span :class="['status-badge', getStatusClass(cita.estado)]">{{
                    cita.estado
                  }}</span>
                </td>
                <td>
                  <button
                    @click="eliminarHistorial(cita.id)"
                    class="btn-action delete"
                  >
                    <font-awesome-icon icon="trash" />
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Detalles de Cita -->
  <div v-if="showDetallesModal" class="modal-overlay" @click="cerrarDetallesModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>Detalles de la Cita</h3>
        <button class="btn-close" @click="cerrarDetallesModal">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <div v-if="citaSeleccionada" class="modal-content">
        <div class="detail-row">
          <span class="detail-label">Estudiante:</span>
          <span class="detail-value">{{ citaSeleccionada.estudiante }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Padre/Madre:</span>
          <span class="detail-value">{{ citaSeleccionada.padre }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha:</span>
          <span class="detail-value">{{ formatDate(citaSeleccionada.fecha) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Hora:</span>
          <span class="detail-value">{{ citaSeleccionada.hora }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Motivo:</span>
          <span class="detail-value">{{ citaSeleccionada.motivo }}</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-action" @click="cerrarDetallesModal">Cerrar</button>
      </div>
    </div>
  </div>
  
  <!-- Modal de Confirmación de Eliminación -->
  <div v-if="showEliminarModal" class="modal-overlay" @click="cerrarEliminarModal">
    <div class="modal-container modal-confirm" @click.stop>
      <div class="modal-header">
        <h3>Confirmar Eliminación</h3>
        <button class="btn-close" @click="cerrarEliminarModal">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <div class="modal-content">
        <div class="confirm-message">
          <font-awesome-icon icon="exclamation-triangle" class="warning-icon" />
          <p>¿Está seguro que desea eliminar esta cita del historial?</p>
          <p class="confirm-subtext">Esta acción no se puede deshacer.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-action cancel" @click="cerrarEliminarModal">Cancelar</button>
        <button class="btn-action delete confirm" @click="confirmarEliminarHistorial">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCitas } from '@/composables/dashboards/profesores/useCitas'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// FontAwesomeIcon is automatically registered with script setup
import {
  faCalendarAlt,
  faCalendarPlus,
  faClock,
  faChevronDown,
  faInbox,
  faUser,
  faCalendarDay,
  faComment,
  faCheck,
  faTimes,
  faReply,
  faCalendarCheck,
  faCalendarTimes,
  faVideo,
  faEye,
  faFolder,
  faFolderOpen,
  faTrash,
  faExclamationTriangle,
  faHistory
} from '@fortawesome/free-solid-svg-icons'

// Add all the icons to the library
library.add(
  faCalendarAlt,
  faCalendarPlus,
  faClock,
  faChevronDown,
  faInbox,
  faUser,
  faCalendarDay,
  faComment,
  faCheck,
  faTimes,
  faReply,
  faCalendarCheck,
  faCalendarTimes,
  faVideo,
  faEye,
  faFolder,
  faFolderOpen,
  faTrash,
  faExclamationTriangle,
  faHistory
)

const {
  citasPendientes,
  citasConfirmadas,
  citasHistorial,
  showPendientesSection,
  showConfirmadasSection,
  showHistorialSection,
  formattedCurrentDate,
  // Modal de detalles
  showDetallesModal,
  citaSeleccionada,
  cerrarDetallesModal,
  // Modal de eliminación
  showEliminarModal,
  confirmarEliminarHistorial,
  cerrarEliminarModal,
  // Funciones de navegación
  togglePendientesSection,
  toggleConfirmadasSection,
  toggleHistorialSection,
  verPendientes,
  // Funciones de acción
  verDetallesCita,
  eliminarHistorial,
  aceptarCita,
  rechazarCita,
  responderCita,
  // Funciones de utilidad
  formatDate,
  getStatusClass,
} = useCitas()
</script>

<style scoped>
@import '@/assets/styles/dashboards/profesores/citas.css';
</style>
