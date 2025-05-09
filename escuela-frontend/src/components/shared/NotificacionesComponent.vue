<template>
  <div class="notificaciones-view">
    <!-- Encabezado de la página -->
    <header class="dashboard-header">
      <h1>Notificaciones</h1>
      <p class="page-description">
        Manténgase al día con las actualizaciones y mensajes importantes del sistema
      </p>
    </header>

    <!-- Sección principal de notificaciones -->
    <div>
      <div class="section-header">
        <div class="header-content">
          <h2>
            <font-awesome-icon icon="bell" />
            Notificaciones Recientes
          </h2>
          <p class="section-description">
            {{ notificacionesFiltradas.length }} notificaciones ({{
              notificacionesStore.cantidadNoLeidas
            }}
            sin leer)
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
            :class="{
              'notificacion-leida': notificacion.leida,
              ['borde-' + notificacion.tipo]: true,
            }"
          >
            <div class="notificacion-icono">
              <font-awesome-icon
                :icon="obtenerIcono(notificacion.tipo)"
                :class="'color-' + notificacion.tipo"
              />
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
                  @click="handleMarcarComoLeida(notificacion.id)"
                >
                  <font-awesome-icon icon="check" />
                  Marcar como leída
                </button>
                <button
                  class="btn-link btn-link-danger"
                  @click="handleEliminarNotificacion(notificacion.id)"
                >
                  <font-awesome-icon icon="trash" />
                  Eliminar
                </button>
                <button
                  v-if="notificacion.accionable"
                  class="btn-link btn-link-primary"
                  @click="handleAccion(notificacion)"
                >
                  <font-awesome-icon :icon="notificacion.accionIcono || 'arrow-right'" />
                  {{ notificacion.accionTexto || 'Ver detalles' }}
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
import { useNotificaciones, type Notificacion } from '@/composables/dashboards/useNotificaciones'

// Definir props
const props = defineProps({
  userRole: {
    type: String,
    default: 'profesor',
    validator: (value: string) => ['profesor', 'direccion'].includes(value)
  }
})

// Definir emits para comunicarse con el componente padre
const emit = defineEmits(['notification-read', 'notification-deleted', 'notification-action'])

// Usar el composable de notificaciones con el rol proporcionado
const {
  filtroEstado,
  filtroTipo,
  notificacionesFiltradas,
  obtenerIcono,
  formatearFecha,
  notificacionesStore,
  marcarComoLeida,
  eliminarNotificacion
} = useNotificaciones(props.userRole)

// Métodos para emitir eventos al componente padre
const handleMarcarComoLeida = (id: number) => {
  marcarComoLeida(id)
  emit('notification-read', id)
}

const handleEliminarNotificacion = (id: number) => {
  eliminarNotificacion(id)
  emit('notification-deleted', id)
}

const handleAccion = (notificacion: Notificacion) => {
  if (notificacion.accionable) {
    emit('notification-action', notificacion)
  }
}
</script>

<style scoped>
@import '@/assets/styles/dashboards/notificaciones.css';
</style>
