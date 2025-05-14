<template>
  <div class="container">
    <!-- Header section with title and add buttons -->
    <div class="header">
      <h1 class="title">Gestión de Estudiantes</h1>
      <div class="header-buttons">
        <button 
          @click="openImportModal" 
          class="btn btn-secondary import-button"
          title="Importar estudiantes desde Excel"
        >
          <font-awesome-icon :icon="['fas', 'file-excel']" />
          Importar Excel
        </button>
        <button 
          @click="openModal(null)" 
          class="btn btn-primary add-button"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          Agregar Estudiante
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="search-container">
      <div class="search-bar">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar estudiante por nombre o sección..." 
          class="search-input"
        />
        <button 
          v-if="searchTerm" 
          @click="searchTerm = ''" 
          class="search-clear-btn"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>

    <!-- Table section -->
    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Sección</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="estudiante in filteredEstudiantes" :key="estudiante.id" class="table-row">
              <td>
                <div class="cell-content">{{ estudiante.nombreCompleto }}</div>
              </td>
              <td>
                <div class="cell-content">{{ estudiante.seccion.nombre }}</div>
              </td>
              <td>
                <div class="cell-content">
                  {{ formatResponsable(estudiante.responsable) }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    @click="verEstudiante(estudiante)" 
                    class="btn-action btn-view"
                    title="Ver detalles"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button 
                    @click="openModal(estudiante)" 
                    class="btn-action btn-edit"
                    title="Editar"
                  >
                    <font-awesome-icon :icon="['fas', 'pen']" />
                  </button>
                  <button 
                    @click="confirmarEliminar(estudiante)" 
                    class="btn-action btn-delete"
                    title="Eliminar"
                  >
                    <font-awesome-icon :icon="['fas', 'trash-alt']" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-if="filteredEstudiantes.length === 0">
              <td colspan="4" class="empty-state">
                {{ estudiantes.length === 0 ? 'No hay estudiantes registrados. Haga clic en "Agregar Estudiante" para comenzar.' : 'No se encontraron estudiantes que coincidan con la búsqueda.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Crear/Editar Estudiante -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ isEditing ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante' }}
            </h2>
            <button @click="closeModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <form @submit.prevent="guardarEstudiante" class="modal-form">
            <!-- Nombre completo -->
            <div class="form-group">
              <label for="nombreCompleto">Nombre Completo</label>
              <input 
                type="text" 
                id="nombreCompleto" 
                v-model="formData.nombreCompleto" 
                class="form-control" 
                required
              />
            </div>

            <!-- Sección -->
            <div class="form-group">
              <label for="seccion">Sección</label>
              <select 
                id="seccion"
                v-model="formData.seccion" 
                class="form-control"
                required
              >
                <option :value="null" disabled>Seleccionar sección</option>
                <option 
                  v-for="seccion in seccionesDisponibles" 
                  :key="seccion.id" 
                  :value="seccion"
                >
                  {{ seccion.nombre }}
                </option>
              </select>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                @click="closeModal" 
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
              >
                {{ isEditing ? 'Guardar Cambios' : 'Crear Estudiante' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Confirmación para Eliminar -->
    <Teleport to="body">
      <div v-if="showConfirmDialog" class="modal-overlay">
        <div class="confirm-dialog">
          <h3 class="confirm-title">Confirmar Eliminación</h3>
          <p class="confirm-message">
            ¿Está seguro que desea eliminar al estudiante {{ estudianteAEliminar?.nombreCompleto }}?
            Esta acción no se puede deshacer.
          </p>
          <div class="confirm-actions">
            <button @click="showConfirmDialog = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="eliminarEstudiante()" class="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal para Importar Estudiantes desde Excel -->
    <Teleport to="body">
      <div v-if="showImportModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              Importar Estudiantes desde Excel
            </h2>
            <button @click="closeImportModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="modal-form">
            <div class="import-instructions">
              <p>Seleccione un archivo Excel (.xlsx) con la lista de estudiantes a importar.</p>
              <p class="import-note">El archivo debe tener las siguientes columnas: <strong>Nombre Completo</strong> y <strong>Sección</strong>.</p>
            </div>

            <div class="file-upload-container">
              <label for="excel-file" class="file-upload-label">
                <font-awesome-icon :icon="['fas', 'file-import']" class="file-icon" />
                <span>Seleccionar archivo Excel</span>
              </label>
              <input 
                type="file" 
                id="excel-file" 
                ref="fileInput"
                accept=".xlsx, .xls"
                class="file-input"
                @change="handleFileChange"
              />
              <div v-if="selectedFile" class="selected-file">
                <span class="file-name">{{ selectedFile.name }}</span>
                <button @click="clearSelectedFile" class="clear-file-btn">
                  <font-awesome-icon :icon="['fas', 'xmark']" />
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                @click="closeImportModal" 
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                @click="uploadFile"
                class="btn btn-primary"
                :disabled="!selectedFile"
              >
                <font-awesome-icon :icon="['fas', 'upload']" />
                Importar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Detalles del Estudiante -->
    <Teleport to="body">
      <div v-if="showDetailsModal" class="modal-overlay">
        <div class="details-modal">
          <div class="details-header">
            <h2 class="details-title">Detalles del Estudiante</h2>
            <button @click="closeDetailsModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="details-content" v-if="selectedEstudiante">
            <div class="details-section">
              <div class="details-avatar">
                <font-awesome-icon :icon="['fas', 'user-graduate']" class="avatar-icon" />
              </div>
              <div class="details-info">
                <h3 class="estudiante-name">{{ selectedEstudiante.nombreCompleto }}</h3>
                <p class="estudiante-seccion">
                  <font-awesome-icon :icon="['fas', 'users']" />
                  Sección: {{ selectedEstudiante.seccion.nombre }}
                </p>
              </div>
            </div>

            <div class="details-section">
              <h4 class="section-title">
                <font-awesome-icon :icon="['fas', 'user-shield']" />
                Información del Responsable
              </h4>
              
              <div v-if="selectedEstudiante.responsable" class="details-info-grid">
                <div class="info-label">Nombre:</div>
                <div class="info-value">{{ selectedEstudiante.responsable.nombreCompleto }}</div>
                
                <div class="info-label">Email:</div>
                <div class="info-value">{{ selectedEstudiante.responsable.email }}</div>
                
                <div class="info-label">Teléfono:</div>
                <div class="info-value">{{ selectedEstudiante.responsable.telefono }}</div>
              </div>
              
              <div v-else class="empty-message">
                No hay responsable registrado para este estudiante
              </div>
            </div>

            <div class="details-actions">
              <button 
                @click="editarDesdeDetalles()" 
                class="btn btn-primary details-btn"
              >
                <font-awesome-icon :icon="['fas', 'pen']" />
                Editar Estudiante
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionestudiantes.css';

/* Estilos específicos para corregir el ancho */
.search-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
}

.table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Corregir posición del botón de agregar */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.header-buttons {
  display: flex;
  gap: 10px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useGestionEstudiantes from '@/composables/dashboards/direccion/useGestionEstudiantes'

const {
  // Estado
  estudiantes,
  formData,
  showModal,
  isEditing,
  showConfirmDialog,
  estudianteAEliminar,
  showDetailsModal,
  selectedEstudiante,
  searchTerm,
  seccionesDisponibles,
  filteredEstudiantes,
  showImportModal,
  
  // Métodos
  formatResponsable,
  openModal,
  closeModal,
  guardarEstudiante,
  verEstudiante,
  closeDetailsModal,
  editarDesdeDetalles,
  confirmarEliminar,
  eliminarEstudiante,
  openImportModal,
  closeImportModal,
  importarEstudiantes
} = useGestionEstudiantes()

// Estado para el archivo seleccionado
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Manejar la selección de archivo
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
  }
}

// Limpiar el archivo seleccionado
const clearSelectedFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Subir el archivo
const uploadFile = () => {
  if (selectedFile.value) {
    importarEstudiantes(selectedFile.value)
    clearSelectedFile()
  }
}
</script>
