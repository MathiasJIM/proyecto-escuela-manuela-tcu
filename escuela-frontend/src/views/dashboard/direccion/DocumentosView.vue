<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Documentos</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear nuevo documento
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
          <label for="tipoFilter" class="filter-label">Tipo:</label>
          <select id="tipoFilter" v-model="filtroTipo" class="filter-select">
            <option value="">Todos</option>
            <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>

        <div class="filter-select-container">
          <label for="destinatarioFilter" class="filter-label">Destinatario:</label>
          <select id="destinatarioFilter" v-model="filtroDestinatario" class="filter-select">
            <option value="">Todos</option>
            <option value="direccion">Solo Dirección</option>
            <option value="profesores">Solo Profesores</option>
            <option value="padres">Solo Padres</option>
          </select>
        </div>
      </div>
      <div class="filter-info">
        <span>{{ documentosFiltrados.length }} documentos encontrados</span>
        <div v-if="isLoading" class="loading-indicator">
          <font-awesome-icon icon="fa-spinner" spin />
          Cargando...
        </div>
      </div>
    </div>

    <!-- Tabla de documentos -->
    <div class="table-container">
      <div v-if="error" class="error-message">
        <font-awesome-icon icon="fa-exclamation-circle" />
        {{ error }}
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-nombre">Título del documento</th>
            <th class="col-descripcion">Descripción</th>
            <th class="col-tipo">Tipo</th>
            <th class="col-fecha">Fecha de subida</th>
            <th class="col-destinatario">Destinatario</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="loading-message">
              <font-awesome-icon icon="fa-spinner" spin />
              Cargando documentos...
            </td>
          </tr>
          <tr v-else-if="documentosFiltrados.length === 0">
            <td colspan="6" class="empty-message">
              No se encontraron documentos. Crea un nuevo documento para comenzar.
            </td>
          </tr>
          <tr v-for="documento in documentosFiltrados" :key="documento.id_documento">
            <td class="documento-titulo">{{ documento.titulo }}</td>
            <td class="documento-descripcion">{{ documento.descripcion || 'Sin descripción' }}</td>
            <td>{{ obtenerNombreTipoDocumento(documento.tipo) }}</td>
            <td>{{ formatearFecha(documento.fecha_subida) }}</td>
            <td>{{ getDestinatarioNombre(documento.destinatario) }}</td>
            <td>
              <div class="acciones">
                <a
                  :href="documento.archivo"
                  target="_blank"
                  class="action-btn view"
                  title="Ver documento"
                >
                  <font-awesome-icon :icon="['fas', 'eye']" />
                </a>
                <button @click="abrirModalEditar(documento)" class="action-btn edit" title="Editar">
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button
                  @click="confirmarEliminar(documento)"
                  class="action-btn delete"
                  title="Eliminar"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar documento -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">
            {{ modoEdicion ? 'Editar documento' : 'Subir nuevo documento' }}
          </h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="handleGuardarDocumento">
            <div class="form-group">
              <label for="tituloDocumento" class="form-label">Título del documento:</label>
              <input
                type="text"
                id="tituloDocumento"
                v-model="formData.titulo"
                class="form-control"
                required
                placeholder="Ej: Circular Inicio de Curso"
              />
            </div>

            <div class="form-group">
              <label for="descripcionDocumento" class="form-label">Descripción:</label>
              <textarea
                id="descripcionDocumento"
                v-model="formData.descripcion"
                class="form-control"
                rows="3"
                placeholder="Descripción opcional del documento"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="tipoDocumento" class="form-label">Tipo de documento:</label>
              <select id="tipoDocumento" v-model="formData.tipo" class="form-control" required>
                <option value="">Seleccione el tipo de documento</option>
                <option value="planeamiento">Planeamiento</option>
                <option value="circular">Circular</option>
                <option value="material">Material</option>
                <option value="informe">Informe</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="archivoDocumento" class="form-label">Enlace:</label>
              <input
                type="url"
                id="archivoDocumento"
                v-model="formData.archivo"
                class="form-control"
                required
                placeholder="https://drive.google.com/file/d/..."
              />
              <small class="form-text text-muted">
                Ingrese un enlace a Google Drive, OneDrive, Dropbox u otro servicio similar
              </small>
            </div>

            <div class="form-group">
              <label for="destinatarioDocumento" class="form-label">Destinatario:</label>
              <select
                id="destinatarioDocumento"
                v-model="formData.destinatario"
                class="form-control"
                required
              >
                <option value="">Seleccione el destinatario</option>
                <option value="direccion">Solo Dirección</option>
                <option value="profesores">Solo Profesores</option>
                <option value="padres">Solo Padres</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-primary" @click="handleGuardarDocumento" :disabled="isLoading">
            <font-awesome-icon v-if="isLoading" icon="fa-spinner" spin class="mr-2" />
            {{ modoEdicion ? 'Guardar cambios' : 'Subir documento' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div class="modal-overlay" v-if="showConfirmDialog">
      <div class="modal-container confirm-modal">
        <div class="modal-header">
          <h2 class="modal-title">Confirmar eliminación</h2>
          <button class="modal-close-btn" @click="cancelarEliminar">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <p class="confirm-message">
            ¿Está seguro que desea eliminar el documento
            <strong>{{ documentoSeleccionado?.titulo }}</strong
            >?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEliminar">Cancelar</button>
          <button class="btn btn-danger" @click="eliminarDocumento" :disabled="isLoading">
            <font-awesome-icon v-if="isLoading" icon="fa-spinner" spin class="mr-2" />
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div class="notification" :class="notification.type" v-if="notification.show">
      <div class="notification-icon">
        <font-awesome-icon
          :icon="
            notification.type === 'success'
              ? 'fa-check-circle'
              : notification.type === 'error'
                ? 'fa-exclamation-circle'
                : notification.type === 'warning'
                  ? 'fa-exclamation-triangle'
                  : 'fa-info-circle'
          "
        />
      </div>
      <div class="notification-content">
        {{ notification.message }}
      </div>
      <button class="notification-close" @click="cerrarNotificacion">
        <font-awesome-icon icon="fa-xmark" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useGestionDocumentos from '@/composables/dashboards/direccion/useGestionDocumentos'

// Tipos de documentos disponibles


// Usar el composable de gestión de documentos
const {
  documentos,
  documentosFiltrados,
  documentoSeleccionado,
  isLoading,
  error,
  showModal,
  showConfirmDialog,
  modoEdicion,
  formData,
  busqueda,
  filtroDestinatario,
  filtroTipo,
  notification,
  tiposDocumento,

  // Métodos
  cargarDocumentos,
  abrirModalCrear,
  abrirModalEditar,
  cerrarModal,
  guardarDocumento,
  confirmarEliminar,
  cancelarEliminar,
  eliminarDocumento,
  mostrarNotificacion,
  cerrarNotificacion,
  formatearFecha,
  getDestinatarioNombre,
  obtenerNombreTipoDocumento,
  handleGuardarDocumento,
} = useGestionDocumentos()

// Cargar documentos al iniciar el componente
onMounted(() => {
  cargarDocumentos()
})
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/documentos.css';
</style>
