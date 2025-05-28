<template>
  <div class="container">
    <!-- Header section with title and add button -->
    <div class="header">
      <h1 class="title">Gestión de Estudiantes</h1>
      <div class="header-buttons">
        <button
          @click="openImportModal"
          class="btn btn-secondary import-button"
          title="Importar estudiantes desde Excel"
        >
          <font-awesome-icon :icon="['fas', 'file-import']" />
          Importar Excel
        </button>
        <button @click="openModal(null)" class="btn btn-primary add-button">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Nuevo Estudiante
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
          placeholder="Buscar estudiante por nombre..."
          class="search-input"
        />
        <button v-if="searchTerm" @click="searchTerm = ''" class="search-clear-btn">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>

    <!-- Table section -->
    <div class="table-container">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre Completo</th>
              <th>Sección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="estudiante in filteredEstudiantes"
              :key="estudiante.id_estudiante"
              class="table-row"
            >
              <td>
                <div class="cell-content">{{ estudiante.cedula }}</div>
              </td>
              <td>
                <div class="cell-content">{{ estudiante.nombre }} {{ estudiante.primer_apellido }} {{ estudiante.segundo_apellido }}</div>
              </td>
              <td>
                <div class="cell-content">
                  <span v-if="estudiante.seccion" class="badge bg-primary">{{
                    estudiante.seccion.nombre
                  }}</span>
                  <span v-else class="badge bg-secondary">Sin asignar</span>
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
                  <button @click="openModal(estudiante)" class="btn-action btn-edit" title="Editar">
                    <font-awesome-icon :icon="['fas', 'pen']" />
                  </button>
                  <button
                    @click="confirmarEliminarEstudiante(estudiante)"
                    class="btn-delete btn"
                    title="Eliminar estudiante"
                  >
                    <font-awesome-icon :icon="['fas', 'trash-alt']" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-if="filteredEstudiantes.length === 0">
              <td colspan="3" class="empty-state">
                {{
                  estudiantes.length === 0
                    ? 'No hay estudiantes registrados. Haga clic en "Nuevo Estudiante" para comenzar.'
                    : 'No se encontraron estudiantes que coincidan con la búsqueda.'
                }}
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
            <!-- Cédula -->
            <div class="form-group">
              <label for="cedula">Cédula:</label>
              <input
                type="text"
                id="cedula"
                v-model="formData.cedula"
                class="form-control"
                required
                placeholder="Ingrese la cédula del estudiante"
              />
            </div>

            <!-- Nombre -->
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                v-model="formData.nombre"
                class="form-control"
                required
                placeholder="Ingrese el nombre del estudiante"
              />
            </div>

            <!-- Primer Apellido -->
            <div class="form-group">
              <label for="primer_apellido">Primer Apellido:</label>
              <input
                type="text"
                id="primer_apellido"
                v-model="formData.primer_apellido"
                class="form-control"
                required
                placeholder="Ingrese el primer apellido"
              />
            </div>

            <!-- Segundo Apellido -->
            <div class="form-group">
              <label for="segundo_apellido">Segundo Apellido:</label>
              <input
                type="text"
                id="segundo_apellido"
                v-model="formData.segundo_apellido"
                class="form-control"
                required
                placeholder="Ingrese el segundo apellido"
              />
            </div>

            <!-- Sección (opcional) -->
            <div class="form-group">
              <label for="seccion">Sección (opcional)</label>
              <select
                id="seccion"
                v-model="formData.id_seccion"
                class="form-control"
                :disabled="cargandoSecciones"
              >
                <option value="">
                  {{
                    cargandoSecciones
                      ? 'Cargando secciones...'
                      : '-- Seleccionar sección (opcional) --'
                  }}
                </option>
                <option
                  v-for="seccion in secciones"
                  :key="seccion.id_seccion"
                  :value="seccion.id_seccion"
                >
                  {{ seccion.nombre }} ({{ seccion.grado }})
                </option>
              </select>
              <small
                v-if="secciones.length === 0 && !cargandoSecciones"
                class="form-text text-danger"
              >
                No hay secciones disponibles. Contacte al administrador para crear secciones.
              </small>
              <small v-else class="form-text text-muted">
                Seleccionar una sección matriculará automáticamente al estudiante en el año lectivo
                {{ anioActivo?.nombre || 'actual' }}.
              </small>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">
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
            ¿Está seguro que desea eliminar al estudiante {{ estudianteAEliminar?.nombre }}? Esta
            acción no se puede deshacer.
          </p>
          <div class="confirm-actions">
            <button
              @click="cerrarModalEliminar"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
            <button @click="eliminarEstudiante()" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal para Importar Estudiantes desde Excel -->
    <Teleport to="body">
      <div v-if="showImportModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Importar Estudiantes desde Excel</h2>
            <button @click="closeImportModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="modal-form">
            <div class="import-instructions">
              <p>Seleccione un archivo Excel (.xlsx) con la lista de estudiantes a importar.</p>
              <p class="import-note">
                El archivo debe tener las siguientes columnas: <strong>Nombre Completo</strong> y
                <strong>Sección</strong>.
              </p>
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
                <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeImportModal" class="btn btn-secondary">
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
        <div class="modal-container details-modal">
          <div class="modal-header">
            <h2 class="modal-title">Detalles del Estudiante</h2>
            <button @click="closeDetailsModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="details-content" v-if="selectedEstudiante">
            <div class="details-section">
              <div class="details-avatar">
                <font-awesome-icon :icon="['fas', 'user-graduate']" class="avatar-icon" />
                <h3 class="estudiante-name">{{ selectedEstudiante.nombre }}</h3>
                <p class="estudiante-seccion" v-if="selectedEstudiante.seccion">
                  <font-awesome-icon :icon="['fas', 'graduation-cap']" />
                  Sección: {{ selectedEstudiante.seccion.nombre }} ({{
                    selectedEstudiante.seccion.grado
                  }})
                </p>
                <p class="estudiante-seccion" v-else>
                  <font-awesome-icon :icon="['fas', 'graduation-cap']" />
                  Sección: <span class="badge bg-secondary">Sin asignar</span>
                </p>
              </div>
            </div>

            <div class="details-section">
              <h4 class="section-title">
                <font-awesome-icon :icon="['fas', 'user-shield']" />
                Información del Responsable
              </h4>

              <div class="details-info-grid">
                <div class="info-label">Nombre:</div>
                <div class="info-value">Padre de {{ selectedEstudiante.nombre }}</div>

                <div class="info-label">Estado de cuenta de padre:</div>
                <div class="info-value">
                  <span v-if="selectedEstudiante.id_padre" class="badge bg-success">Asignada</span>
                  <span v-else class="badge bg-warning">No asignada</span>
                </div>
              </div>
            </div>

            <div class="details-actions">
              <button @click="openModal(selectedEstudiante)" class="btn btn-primary details-btn">
                <font-awesome-icon :icon="['fas', 'pen']" />
                Editar Estudiante
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Credenciales del Padre -->
    <Teleport to="body">
      <div v-if="showCredencialesModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Credenciales de Acceso</h2>
            <button @click="showCredencialesModal = false" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="modal-content">
            <div class="credenciales-container">
              <div class="alert alert-success">
                <p><strong>¡Estudiante creado exitosamente!</strong></p>
                <p>
                  Se ha generado automáticamente una cuenta para el padre del estudiante con las
                  siguientes credenciales:
                </p>
              </div>

              <div class="credencial-item">
                <label>Correo electrónico:</label>
                <div class="credencial-value">
                  <span>{{ credencialesPadre?.correo }}</span>
                  <button
                    @click="copiarAlPortapapeles(credencialesPadre?.correo)"
                    class="btn btn-sm btn-outline-primary"
                    title="Copiar al portapapeles"
                  >
                    <font-awesome-icon :icon="['fas', 'copy']" />
                  </button>
                </div>
              </div>

              <div class="credencial-item">
                <label>Contraseña:</label>
                <div class="credencial-value">
                  <span>{{ credencialesPadre?.contrasena }}</span>
                  <button
                    @click="copiarAlPortapapeles(credencialesPadre?.contrasena)"
                    class="btn btn-sm btn-outline-primary"
                    title="Copiar al portapapeles"
                  >
                    <font-awesome-icon :icon="['fas', 'copy']" />
                  </button>
                </div>
              </div>

              <div class="alert alert-warning mt-3">
                <p><strong>¡Importante!</strong></p>
                <p>
                  Por favor, guarde o entregue estas credenciales al padre del estudiante. Por
                  motivos de seguridad, la contraseña no podrá ser recuperada después de cerrar este
                  mensaje.
                </p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showCredencialesModal = false" class="btn btn-secondary">Entendido</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionestudiantes.css';
</style>

<script setup lang="ts">
import { ref } from 'vue'
import useGestionEstudiantes from '@/composables/dashboards/direccion/useGestionEstudiantes'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const {
  estudiantes,
  cargando: loading,
  formData,
  isEditing,
  showModal,
  showConfirmDialog,
  estudianteAEliminar,
  openModal,
  closeModal,
  guardarEstudiante,
  eliminarEstudiante,
  confirmarEliminarEstudiante,
  verEstudiante,
  showDetailsModal,
  selectedEstudiante,
  closeDetailsModal,
  searchTerm,
  filteredEstudiantes,
  showImportModal,
  openImportModal,
  closeImportModal,
  procesarArchivo,
  secciones,
  anioActivo,
  cargandoSecciones,
  showCredencialesModal,
  credencialesPadre
} = useGestionEstudiantes()

// Función para cerrar el modal de eliminación
const cerrarModalEliminar = () => {
  showConfirmDialog.value = false
  estudianteAEliminar.value = null
}

// Función para copiar al portapapeles
const copiarAlPortapapeles = (texto: string | undefined) => {
  if (!texto) return

  navigator.clipboard
    .writeText(texto)
    .then(() => {
      alert('Copiado al portapapeles')
    })
    .catch((err) => {
      console.error('Error al copiar: ', err)
    })
}

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

// Formatear el tamaño del archivo
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// Subir el archivo
const uploadFile = async () => {
  if (selectedFile.value) {
    await procesarArchivo(selectedFile.value)
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>
