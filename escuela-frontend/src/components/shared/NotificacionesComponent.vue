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
            {{ notificacionesFiltradas.length }} notificaciones ({{ cantidadNoLeidas }} sin leer)
          </p>
        </div>
        <div class="section-actions">
          <button
            v-if="notificacionesStore.cantidadNoLeidas > 0"
            class="btn btn-outline"
            @click="marcarTodasComoLeidas"
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
                  <option value="aviso">Avisos</option>
                  <option value="mensaje">Mensajes</option>
                  <option value="alerta">Alertas</option>
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
                <span class="notificacion-fecha" :title="notificacion.fecha.toLocaleString()">{{ formatearFecha(notificacion.fecha) }}</span>
              </div>
              <p class="notificacion-mensaje">{{ notificacion.mensaje }}</p>
              <div class="notificacion-acciones">
                <button
                  v-if="!notificacion.leida"
                  class="btn-link"
                  @click="handleMarcarComoLeida(notificacion)"
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
import { useAvisosNotificaciones } from '@/composables/dashboards/useAvisosNotificaciones'
import { ref, computed } from 'vue'
import type { Notificacion } from '@/composables/dashboards/useNotificaciones'

// Obtener el rol del usuario desde las props
const props = defineProps({
  userRole: {
    type: String,
    default: 'profesor',
    validator(value: string) {
      return ['profesor', 'direccion', 'padre'].includes(value)
    }
  }
})

// Definir emits para comunicarse con el componente padre
const emit = defineEmits(['notification-read', 'notification-deleted', 'notification-action'])

// Filtros
const filtroEstado = ref<'leida' | 'no-leida' | 'todas'>('todas')
const filtroTipo = ref<string>('todas')

// Usar el composable de avisos y notificaciones
const { 
  notificacionesStore, 
  todasLasNotificaciones,
  cantidadNoLeidas,
  marcarAvisoComoLeido,
  marcarTodosAvisosComoLeidos,
  formatearFecha,
  obtenerIcono
} = useAvisosNotificaciones(props.userRole)

// Filtrar notificaciones según los filtros seleccionados
const notificacionesFiltradas = computed(() => {
  let resultado = [...todasLasNotificaciones.value]
  
  // Filtrar por estado
  if (filtroEstado.value === 'leida') {
    resultado = resultado.filter(n => n.leida)
  } else if (filtroEstado.value === 'no-leida') {
    resultado = resultado.filter(n => !n.leida)
  }
  
  // Filtrar por tipo
  if (filtroTipo.value !== 'todas') {
    resultado = resultado.filter(n => n.tipo === filtroTipo.value)
  }
  
  return resultado
})

// Métodos para manejar las notificaciones
function handleMarcarComoLeida(notificacion: Notificacion) {
  if (notificacion.tipo === 'aviso' && notificacion.avisoId) {
    marcarAvisoComoLeido(notificacion.avisoId)
  } else {
    notificacionesStore.marcarComoLeida(notificacion.id)
  }
  emit('notification-read', notificacion.id)
}

function handleEliminarNotificacion(id: number) {
  notificacionesStore.eliminarNotificacion(id)
  emit('notification-deleted', id)
}

function handleAccion(notificacion: Notificacion) {
  if (notificacion.accionable && notificacion.accion) {
    emit('notification-action', {
      id: notificacion.id,
      accion: notificacion.accion,
      tipo: notificacion.tipo,
      avisoId: notificacion.avisoId // Pasar el ID del aviso si existe
    })
    
    // Marcar como leída automáticamente cuando se realiza una acción
    if (!notificacion.leida) {
      handleMarcarComoLeida(notificacion)
    }
  }
}

// Función para marcar todas las notificaciones como leídas
function marcarTodasComoLeidas() {
  notificacionesStore.marcarTodasComoLeidas()
  marcarTodosAvisosComoLeidos()
}
</script>

<style scoped>
@import '@/assets/styles/dashboards/notificaciones.css';
@import '@/assets/styles/dashboards/shared/notification-badge.css';
</style>
