<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Avisos</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear Aviso
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-group">
        <div class="search-container">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar por título..."
            class="search-input"
          />
          <font-awesome-icon icon="fa-search" class="search-icon" />
        </div>

        <div class="filter-select-container">
          <label for="destinatarioFilter" class="filter-label">Destinatario:</label>
          <select id="destinatarioFilter" v-model="filtroDestinatario" class="filter-select">
            <option value="">Todos</option>
            <option value="todos">Todos</option>
            <option value="profesores">Profesores</option>
            <option value="padres">Padres</option>
          </select>
        </div>


      </div>
      <div class="filter-info">
        <span>{{ avisosFiltradosPorDestinatario.length }} avisos encontrados</span>
      </div>
    </div>

    <!-- Tabla de avisos -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-titulo">Título</th>
            <th class="col-fecha">Fecha de envío</th>
            <th class="col-destinatarios">Destinatarios</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="avisosFiltrados.length === 0">
            <td colspan="4" class="empty-message">
              No se encontraron avisos. Crea un nuevo aviso para comenzar.
            </td>
          </tr>

          <tr v-for="aviso in avisosFiltradosPorDestinatario" :key="aviso.id_aviso">
            <td class="aviso-titulo">{{ aviso.titulo }}</td>
            <td>{{ formatDate(new Date(aviso.fecha_envio)) }}</td>
            <td>
              <span v-if="aviso.destinatario === 'todos'">Todos</span>
              <span v-else-if="aviso.destinatario === 'profesores'">Profesores</span>
              <span v-else-if="aviso.destinatario === 'padres'">Padres</span>
              <span v-else>{{ aviso.destinatario }}</span>
            </td>
            <td>
              <div class="acciones">
                <button class="action-btn view" @click="() => verAviso(aviso)" title="Ver detalles">
                  <font-awesome-icon :icon="['fas', 'eye']" />
                </button>
                <button class="action-btn edit" @click="() => editarAviso(aviso)" title="Editar aviso">
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button
                  class="action-btn delete"
                  @click="() => confirmarEliminar(aviso)"
                  title="Eliminar aviso"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar aviso -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicion ? 'Editar aviso' : 'Crear nuevo aviso' }}</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="guardarAviso">
            <div class="form-group">
              <label for="tituloAviso" class="form-label">Título del aviso:</label>
              <input
                type="text"
                id="tituloAviso"
                v-model="avisoForm.titulo"
                class="form-control"
                required
                placeholder="Ej: Reunión de padres"
              />
            </div>

            <div class="form-group">
              <label for="contenidoAviso" class="form-label">Contenido del aviso:</label>
              <textarea
                id="contenidoAviso"
                v-model="avisoForm.contenido"
                class="form-control"
                rows="4"
                required
                placeholder="Escriba el contenido del aviso aquí..."
              ></textarea>
            </div>



            <div class="form-group">
              <label for="destinatarioAviso" class="form-label">Destinatario:</label>
              <select
                id="destinatarioAviso"
                v-model="avisoForm.destinatario"
                class="form-control"
                required
              >
                <option value="todos">Todos</option>
                <option value="profesores">Profesores</option>
                <option value="padres">Padres</option>
              </select>
            </div>




          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-primary" @click="guardarAviso" :disabled="!esFormularioValido">
            {{ modoEdicion ? 'Guardar cambios' : 'Crear aviso' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para ver aviso -->
    <div class="modal-overlay" v-if="showVerModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ avisoSeleccionado?.titulo }}</h2>
          <button class="modal-close-btn" @click="cerrarModalVer">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <div class="aviso-detalles">
            <div class="aviso-meta">
              <p>
                <strong>Fecha de envío:</strong> {{ formatDate(new Date(avisoSeleccionado?.fecha_envio || '')) }}
              </p>
              <p>
                <strong>Destinatario:</strong> 
                <span v-if="avisoSeleccionado?.destinatario === 'todos'">Todos</span>
                <span v-else-if="avisoSeleccionado?.destinatario === 'profesores'">Profesores</span>
                <span v-else-if="avisoSeleccionado?.destinatario === 'padres'">Padres</span>
                <span v-else>{{ avisoSeleccionado?.destinatario }}</span>
              </p>
              <p>
                <strong>Estado:</strong> Enviado
              </p>
            </div>
            <div class="aviso-cuerpo">
              <p>{{ avisoSeleccionado?.contenido }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="cerrarModalVer">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div class="modal-overlay" v-if="showConfirmModal">
      <div class="modal-container confirm-modal">
        <div class="modal-header">
          <h2 class="modal-title">Confirmar eliminación</h2>
          <button class="modal-close-btn" @click="cancelarEliminar">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <p class="confirm-message">
            ¿Está seguro que desea eliminar el aviso <strong>{{ avisoAEliminar?.titulo }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEliminar">Cancelar</button>
          <button class="btn btn-danger" @click="eliminarAvisoYCerrarModal">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div class="notification" v-if="notification.show" :class="notification.type">
      <div class="notification-content">
        <font-awesome-icon :icon="notification.type === 'success' ? 'check-circle' : 'exclamation-circle'" class="notification-icon" />
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button class="notification-close" @click="closeNotification">
        <font-awesome-icon icon="fa-xmark" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import useAvisos from '@/composables/dashboards/direccion/useAvisos'
import { ref, computed } from 'vue'
import type { Aviso } from '@/services/avisos.service'

const showConfirmModal = ref(false)
const avisoAEliminar = ref<Aviso | null>(null)

// Variables para la tabla
const filtroDestinatario = ref('')

// Computed para filtrar avisos por destinatario
const avisosFiltradosPorDestinatario = computed(() => {
  if (!filtroDestinatario.value) return avisosFiltrados.value
  
  return avisosFiltrados.value.filter(aviso => {
    return aviso.destinatario === filtroDestinatario.value
  })
})

const {
  busqueda,
  showModal,
  showVerModal,
  avisoForm,
  avisoSeleccionado,
  avisosFiltrados,
  esFormularioValido,
  notification,
  modoEdicion,
  abrirModalCrear,
  cerrarModal,
  cerrarModalVer,
  guardarAviso,
  verAviso,
  eliminarAviso,
  formatDate,
  editarAviso
} = useAvisos()

// Función para cerrar la notificación
const closeNotification = () => {
  notification.value.show = false
}

const cancelarEliminar = () => {
  showConfirmModal.value = false
  avisoAEliminar.value = null
}

const eliminarAvisoYCerrarModal = async () => {
  if (avisoAEliminar.value) {
    await eliminarAviso(avisoAEliminar.value)
    showConfirmModal.value = false
    avisoAEliminar.value = null
  }
}

const confirmarEliminar = (aviso: Aviso) => {
  avisoAEliminar.value = aviso
  showConfirmModal.value = true
}


</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/avisos.css';
</style>
