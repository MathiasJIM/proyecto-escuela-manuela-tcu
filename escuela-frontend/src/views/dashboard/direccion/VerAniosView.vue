<template>
  <div class="container">
    <!-- Header section with title and action button -->
    <div class="header">
      <h1 class="title">Años Lectivos</h1>
      <button @click="openModal()" class="btn btn-primary create-btn">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Crear Año
      </button>
    </div>

    <!-- Search bar -->
    <div class="search-container">
      <div class="search-bar">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar por año o fechas..." 
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

    <!-- Table of años lectivos -->
    <div class="table-container">
      <div class="table-actions">
        <!-- Espacio reservado para acciones adicionales futuras -->
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Año Lectivo</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Finalización</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredAnios.length === 0">
              <td colspan="5" class="empty-state">
                <p v-if="searchTerm">No se encontraron años lectivos que coincidan con la búsqueda.</p>
                <p v-else>No hay años lectivos registrados. Haga clic en "Crear Nuevo Año" para comenzar.</p>
              </td>
            </tr>
            <tr v-for="anio in filteredAnios" :key="anio.id_anio">
              <td>
                <div class="cell-content font-bold">{{ anio.nombre }}</div>
              </td>
              <td>
                <div class="cell-content">{{ formatearFecha(anio.fecha_inicio) }}</div>
              </td>
              <td>
                <div class="cell-content">{{ formatearFecha(anio.fecha_fin) }}</div>
              </td>
              <td>
                <div class="status-badge" :class="anio.activo ? 'active' : 'inactive'">
                  <font-awesome-icon 
                    v-if="anio.activo" 
                    :icon="['fas', 'check-circle']" 
                    class="icon" 
                  />
                  {{ anio.activo ? 'Activo' : 'Inactivo' }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    @click="verAnio(anio)" 
                    class="action-btn view" 
                    title="Ver detalles"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button 
                    @click="openModal(anio)" 
                    class="action-btn edit" 
                    title="Editar"
                  >
                    <font-awesome-icon :icon="['fas', 'pen']" />
                  </button>
                  <button 
                    @click="confirmarEliminar(anio)" 
                    class="action-btn delete" 
                    title="Eliminar"
                    :disabled="anio.activo"
                  >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear/Editar Año -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ isEditing ? 'Editar Año Lectivo' : 'Crear Nuevo Año Lectivo' }}
            </h2>
            <button @click="closeModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="modal-form">
            <div class="form-group">
              <label for="nombre" class="form-label">Año *</label>
              <input 
                type="number" 
                id="nombre" 
                v-model="formData.nombre" 
                class="form-input" 
                placeholder="Ingrese el año"
                min="2000"
                max="2100"
                required
              />
            </div>

            <div class="form-group">
              <label for="fecha_inicio" class="form-label">Fecha de Inicio *</label>
              <input 
                type="date" 
                id="fecha_inicio" 
                v-model="formData.fecha_inicio" 
                class="form-input" 
                required
                pattern="\d{4}-\d{2}-\d{2}"
              />
            </div>

            <div class="form-group">
              <label for="fecha_fin" class="form-label">Fecha de Finalización *</label>
              <input 
                type="date" 
                id="fecha_fin" 
                v-model="formData.fecha_fin" 
                class="form-input" 
                required
              />
            </div>

            <div class="form-group">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  id="activo" 
                  v-model="formData.activo" 
                  class="form-check-input"
                />
                <label for="activo" class="form-check-label">
                  Marcar como año activo
                </label>
              </div>
              <p class="text-muted mt-4" style="font-size: 12px;">
                Nota: Al marcar este año como activo, cualquier otro año activo será desactivado automáticamente.
              </p>
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
                type="button" 
                @click="guardarAnio" 
                class="btn btn-primary"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Detalles del Año -->
    <Teleport to="body">
      <div v-if="showDetailsModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              Detalles del Año Lectivo
            </h2>
            <button @click="closeDetailsModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="details-container" v-if="anioSeleccionado">
            <div class="details-group">
              <div class="details-label">Año</div>
              <div class="details-value">{{ anioSeleccionado.nombre }}</div>
            </div>

            <div class="details-group">
              <div class="details-label">Fecha de Inicio</div>
              <div class="details-value">{{ formatearFecha(anioSeleccionado.fecha_inicio) }}</div>
            </div>

            <div class="details-group">
              <div class="details-label">Fecha de Finalización</div>
              <div class="details-value">{{ formatearFecha(anioSeleccionado.fecha_fin) }}</div>
            </div>

            <div class="details-group">
              <div class="details-label">Estado</div>
              <div class="status-badge" :class="anioSeleccionado.activo ? 'active' : 'inactive'">
                <font-awesome-icon 
                  v-if="anioSeleccionado.activo" 
                  :icon="['fas', 'check-circle']" 
                  class="icon" 
                />
                {{ anioSeleccionado.activo ? 'Activo' : 'Inactivo' }}
              </div>
            </div>

            <div class="details-actions">
              <button 
                v-if="!anioSeleccionado.activo"
                @click="marcarComoActivo(anioSeleccionado, true)" 
                class="btn btn-secondary"
              >
                <font-awesome-icon :icon="['fas', 'calendar-check']" />
                Marcar como Activo
              </button>
              <button 
                @click="editarDesdeDetalles" 
                class="btn btn-primary"
              >
                <font-awesome-icon :icon="['fas', 'pen']" />
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Confirmación para Eliminar -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Confirmar Eliminación</h2>
            <button @click="showConfirmModal = false" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="confirm-dialog">
            <p class="confirm-message">
              ¿Está seguro que desea eliminar el año lectivo <span class="font-bold">{{ anioAEliminar?.nombre }}</span>?
              <br>
              <span class="text-danger">Esta acción no se puede deshacer.</span>
            </p>

            <div class="confirm-actions">
              <button 
                @click="showConfirmModal = false" 
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                @click="eliminarAnioLectivo" 
                class="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrash, faEye, faCheckCircle, faSearch, faTimes, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAniosLectivos } from '@/composables/dashboards/direccion/useAniosLectivos';
import { formatDate } from '@/utils/formatters';

// Registrar los iconos necesarios
library.add(faPen, faTrash, faEye, faCheckCircle, faSearch, faTimes, faPlus, faXmark);

// Usar el composable de años lectivos
const {
  // Estado
  aniosLectivos,
  anioLectivoActivo,
  anioSeleccionado,
  cargando,
  error,
  busqueda,
  showConfirmModal,
  anioAEliminar,
  notificacion,
  aniosFiltrados,
  
  // Métodos
  cargarAniosLectivos,
  obtenerAnioLectivo,
  crearAnioLectivo,
  actualizarAnioLectivo,
  confirmarEliminarAnio,
  cancelarEliminarAnio,
  eliminarAnioLectivo,
  cambiarEstadoAnio,
  mostrarNotificacion,
  cerrarNotificacion
} = useAniosLectivos();

// Estado local para modales
const showModal = ref(false);
const showDetailsModal = ref(false);
const isEditing = ref(false);

// Estado del formulario
const formData = ref({
  nombre: '',
  fecha_inicio: '',
  fecha_fin: '',
  activo: false
});

// Función para formatear fecha en YYYY-MM-DD
const formatDateForBackend = (dateString: string) => {
  if (!dateString) return '';
  return dateString; // El input type="date" ya devuelve el formato YYYY-MM-DD
};

// Mapear searchTerm a busqueda del composable
const searchTerm = computed({
  get: () => busqueda.value,
  set: (val) => { busqueda.value = val }
});

// Mapear filteredAnios a aniosFiltrados del composable
const filteredAnios = computed(() => aniosFiltrados.value);

// Formatear fecha para mostrar en la tabla
const formatearFecha = (fecha: string) => {
  return formatDate(fecha, 'dd/MM/yyyy');
};

// Ver detalles de un año lectivo
const verAnio = (anio: any) => {
  anioSeleccionado.value = anio;
  showDetailsModal.value = true;
};

// Cerrar modal de detalles
const closeDetailsModal = () => {
  showDetailsModal.value = false;
  anioSeleccionado.value = null;
};

// Abrir modal para editar
const openModal = (anio?: any) => {
  if (anio) {
    anioSeleccionado.value = anio;
    isEditing.value = true;
    // Inicializar el formulario con los datos del año seleccionado
    formData.value = {
      nombre: anio.nombre,
      fecha_inicio: anio.fecha_inicio,
      fecha_fin: anio.fecha_fin,
      activo: anio.activo
    };
  } else {
    anioSeleccionado.value = null;
    isEditing.value = false;
    // Reiniciar el formulario
    formData.value = {
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      activo: false
    };
  }
  showModal.value = true;
};

// Editar desde la vista de detalles
const editarDesdeDetalles = () => {
  openModal(anioSeleccionado.value);
  closeDetailsModal();
};

// Cerrar modal de edición
const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  anioSeleccionado.value = null;
};

// Guardar cambios en un año lectivo
const guardarAnio = async () => {
  // Validar datos del formulario
  if (!formData.value.nombre || !formData.value.fecha_inicio || !formData.value.fecha_fin) {
    mostrarNotificacion('Error', 'Todos los campos son obligatorios', 'error');
    return;
  }

  // Validar que la fecha de fin sea posterior a la fecha de inicio
  if (new Date(formData.value.fecha_inicio) >= new Date(formData.value.fecha_fin)) {
    mostrarNotificacion('Error', 'La fecha de finalización debe ser posterior a la fecha de inicio', 'error');
    return;
  }

  // Validar que el nombre del año tenga entre 4 y 9 caracteres
  if (formData.value.nombre.length < 4 || formData.value.nombre.length > 9) {
    mostrarNotificacion('Error', 'El nombre del año debe tener entre 4 y 9 caracteres', 'error');
    return;
  }

  try {
    // Crear un objeto literal exactamente como lo espera el backend
    // Usando la estructura exacta del ejemplo proporcionado
    // Asegurarse de que el nombre sea un string
    const payload = {
      "nombre": String(formData.value.nombre),
      "fecha_inicio": formData.value.fecha_inicio,
      "fecha_fin": formData.value.fecha_fin,
      "activo": formData.value.activo
    };

    // Mostrar los datos que se van a enviar para depuración
    console.log('Datos a enviar:', JSON.stringify(payload));

    if (isEditing.value && anioSeleccionado.value) {
      // Actualizar año existente
      await actualizarAnioLectivo(anioSeleccionado.value.id_anio, payload);
    } else {
      // Crear nuevo año
      await crearAnioLectivo(payload);
    }
    closeModal();
    await cargarAniosLectivos();
  } catch (err: any) {
    console.error('Error al guardar año lectivo:', err);
    
    let mensajeError = 'Ocurrió un error al guardar el año lectivo. Intente nuevamente.';
    if (err.response && err.response.data && err.response.data.detail) {
      mensajeError = err.response.data.detail;
    }
    
    mostrarNotificacion('Error', mensajeError, 'error');
  }
};

// Confirmar eliminación de un año lectivo
const confirmarEliminar = (anio: any) => {
  confirmarEliminarAnio(anio);
};

// Marcar un año como activo o inactivo
const marcarComoActivo = async (anio: any, activar: boolean) => {
  await cambiarEstadoAnio(anio, activar);
  await cargarAniosLectivos();
};

// Cargar años lectivos al inicializar el componente
onMounted(async () => {
  try {
    await cargarAniosLectivos();
  } catch (error) {
    console.error('Error al cargar años lectivos:', error);
  }
});
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionanios.css';
</style>
