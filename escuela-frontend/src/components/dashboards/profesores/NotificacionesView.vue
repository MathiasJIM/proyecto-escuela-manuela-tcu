<template>
  <div class="notificaciones-view">
    <!-- Encabezado de la página -->
    <header class="dashboard-header">
      <h1>Notificaciones</h1>
      <p class="page-description">Manténgase al día con las actualizaciones y mensajes importantes del sistema</p>
    </header>

    <!-- Sección principal de notificaciones -->
    <div class="dashboard-card-section">
      <div class="section-header">
        <div class="header-content">
          <h2>
            <font-awesome-icon icon="bell" />
            Notificaciones Recientes
          </h2>
          <p class="section-description">
            {{ notificacionesFiltradas.length }} notificaciones ({{ notificacionesStore.cantidadNoLeidas }} sin leer)
          </p>
        </div>
        <div class="section-actions">
          <button 
            v-if="notificacionesStore.cantidadNoLeidas > 0" 
            class="btn btn-outline" 
            @click="notificacionesStore.marcarTodasComoLeidas"
          >
            <font-awesome-icon icon="check-double" />
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div class="section-content">
        <!-- Filtros de notificaciones -->
        <div class="filtros-container">
          <div class="filtro-grupo">
            <div class="select-container">
              <label for="filtro-estado">Filtrar por estado:</label>
              <div class="select-wrapper">
                <select id="filtro-estado" v-model="filtroEstado" class="form-control">
                  <option value="todas">Todas las notificaciones</option>
                  <option value="leidas">Solo leídas</option>
                  <option value="no-leidas">Solo no leídas</option>
                </select>
                <div class="select-icon">
                  <font-awesome-icon icon="chevron-down" />
                </div>
              </div>
            </div>
          </div>
          <div class="filtro-grupo">
            <div class="select-container">
              <label for="filtro-tipo">Filtrar por tipo:</label>
              <div class="select-wrapper">
                <select id="filtro-tipo" v-model="filtroTipo" class="form-control">
                  <option value="todas">Todos los tipos</option>
                  <option value="sistema">Sistema</option>
                  <option value="cita">Citas</option>
                  <option value="material">Material</option>
                  <option value="calendario">Calendario</option>
                </select>
                <div class="select-icon">
                  <font-awesome-icon icon="chevron-down" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de notificaciones -->
        <div v-if="notificacionesFiltradas.length > 0" class="notificaciones-lista">
          <div 
            v-for="notificacion in notificacionesFiltradas" 
            :key="notificacion.id" 
            class="notificacion-item"
            :class="{ 'notificacion-leida': notificacion.leida, ['borde-' + notificacion.tipo]: true }"
          >
            <div class="notificacion-icono">
              <font-awesome-icon :icon="obtenerIcono(notificacion.tipo)" :class="'color-' + notificacion.tipo" />
            </div>
            <div class="notificacion-contenido">
              <div class="notificacion-header">
                <h3 class="notificacion-titulo">{{ notificacion.titulo }}</h3>
                <span class="notificacion-fecha">{{ formatearFecha(notificacion.fecha) }}</span>
              </div>
              <p class="notificacion-mensaje">{{ notificacion.mensaje }}</p>
              <div class="notificacion-acciones">
                <button 
                  v-if="!notificacion.leida" 
                  class="btn-link" 
                  @click="notificacionesStore.marcarComoLeida(notificacion.id)"
                >
                  <font-awesome-icon icon="check" />
                  Marcar como leída
                </button>
                <button class="btn-link btn-link-danger" @click="notificacionesStore.eliminarNotificacion(notificacion.id)">
                  <font-awesome-icon icon="trash" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <font-awesome-icon icon="bell-slash" />
          </div>
          <h3>No tienes notificaciones</h3>
          <p>No hay notificaciones que coincidan con los filtros seleccionados</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificacionesStore } from '@/stores/notificacionesStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faBell, 
  faCheck, 
  faCheckDouble, 
  faTrash, 
  faBellSlash, 
  faCalendarAlt, 
  faBook, 
  faUsers, 
  faCog,
  faChevronDown 
} from '@fortawesome/free-solid-svg-icons'

// Registrar los íconos
library.add(
  faBell, 
  faCheck, 
  faCheckDouble, 
  faTrash, 
  faBellSlash, 
  faCalendarAlt, 
  faBook, 
  faUsers, 
  faCog,
  faChevronDown
)

// Usar la store de notificaciones
const notificacionesStore = useNotificacionesStore()

// Filtros
const filtroEstado = ref('todas')
const filtroTipo = ref('todas')

// Computed properties
const notificacionesFiltradas = computed(() => {
  return notificacionesStore.notificacionesFiltradas(filtroEstado.value, filtroTipo.value)
})

const obtenerIcono = (tipo: string) => {
  switch (tipo) {
    case 'cita':
      return 'users'
    case 'material':
      return 'book'
    case 'calendario':
      return 'calendar-alt'
    case 'sistema':
    default:
      return 'cog'
  }
}

const formatearFecha = (fecha: Date) => {
  const hoy = new Date()
  const ayer = new Date(hoy)
  ayer.setDate(ayer.getDate() - 1)
  
  const esHoy = fecha.getDate() === hoy.getDate() && 
                fecha.getMonth() === hoy.getMonth() && 
                fecha.getFullYear() === hoy.getFullYear()
  
  const esAyer = fecha.getDate() === ayer.getDate() && 
                 fecha.getMonth() === ayer.getMonth() && 
                 fecha.getFullYear() === ayer.getFullYear()
  
  const opciones: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit'
  }
  
  let fechaFormateada = ''
  
  if (esHoy) {
    fechaFormateada = `Hoy, ${fecha.toLocaleTimeString('es-ES', opciones)}`
  } else if (esAyer) {
    fechaFormateada = `Ayer, ${fecha.toLocaleTimeString('es-ES', opciones)}`
  } else {
    opciones.day = '2-digit'
    opciones.month = '2-digit'
    opciones.year = 'numeric'
    fechaFormateada = fecha.toLocaleDateString('es-ES', opciones)
  }
  
  return fechaFormateada
}
</script>

<style scoped>
.notificaciones-view {
  padding: var(--spacing-md);
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: var(--spacing-xl);
}

.dashboard-header h1 {
  font-size: var(--font-size-3xl);
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.page-description {
  color: var(--text-medium);
  font-size: var(--font-size-base);
}

.dashboard-card-section {
  background-color: var(--bg-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-xl);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.section-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.header-content h2 {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  margin: 0;
}

.header-content h2 svg {
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
}

.section-description {
  color: var(--text-medium);
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-sm);
}

.section-content {
  padding: var(--spacing-lg);
}

/* Filtros */
.filtros-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.filtro-grupo {
  flex: 1;
  min-width: 200px;
}

.select-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.select-wrapper {
  position: relative;
  width: 100%;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.select-wrapper:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.select-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.3);
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  pointer-events: none;
  font-size: 0.8rem;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.select-wrapper:hover .select-icon {
  opacity: 1;
}

select.form-control {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding: 10px 35px 10px 12px;
  background-color: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s ease;
}

select.form-control:hover {
  border-color: var(--primary-light);
}

select.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Lista de notificaciones */
.notificaciones-lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.notificacion-item {
  display: flex;
  background-color: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
  border-left: 4px solid var(--primary-color);
}

.notificacion-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.notificacion-leida {
  opacity: 0.7;
  border-left-color: var(--text-light);
}

.notificacion-icono {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: var(--spacing-md);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.color-cita {
  color: var(--info-color);
}

.color-material {
  color: var(--success-color);
}

.color-calendario {
  color: var(--warning-color);
}

.color-sistema {
  color: var(--secondary-color);
}

.borde-cita {
  border-left-color: var(--info-color);
}

.borde-material {
  border-left-color: var(--success-color);
}

.borde-calendario {
  border-left-color: var(--warning-color);
}

.borde-sistema {
  border-left-color: var(--secondary-color);
}

.notificacion-contenido {
  flex: 1;
}

.notificacion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xs);
}

.notificacion-titulo {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-dark);
}

.notificacion-fecha {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  white-space: nowrap;
  margin-left: var(--spacing-md);
}

.notificacion-mensaje {
  color: var(--text-medium);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.notificacion-acciones {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
  gap: var(--spacing-xs);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-link-danger {
  color: var(--error-color);
}

/* Estado vacío */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-2xl) 0;
  color: var(--text-medium);
  background-color: var(--bg-off-white);
  border-radius: var(--border-radius-lg);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
  color: var(--primary-color);
}

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-dark);
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-actions {
    margin-top: var(--spacing-md);
  }
  
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filtro-grupo {
    width: 100%;
  }
  
  .notificacion-header {
    flex-direction: column;
  }
  
  .notificacion-fecha {
    margin-left: 0;
    margin-top: var(--spacing-xs);
  }
}
</style>
