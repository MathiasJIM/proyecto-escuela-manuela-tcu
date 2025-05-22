<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Gestión de Secciones</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear nueva sección
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-group">
        <div class="search-container">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar por nombre o grado..."
            class="search-input"
          />
          <font-awesome-icon icon="fa-search" class="search-icon" />
        </div>
      </div>
      <div class="filter-info">
        <span>{{ seccionesFiltradas.length }} secciones encontradas</span>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando secciones...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="cargarSecciones()" class="btn btn-primary">Reintentar</button>
    </div>

    <!-- Tabla de secciones -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grado</th>
            <th>Profesor Guía</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="seccionesFiltradas.length === 0">
            <td colspan="4" class="empty-message">
              No se encontraron secciones. Crea una nueva sección para comenzar.
            </td>
          </tr>
          <tr v-for="seccion in seccionesFiltradas" :key="seccion.id_seccion">
            <td class="seccion-nombre">{{ seccion.nombre }}</td>
            <td>{{ seccion.grado }}</td>
            <td>
              <span v-if="seccion.profesor_guia_nombre">{{ seccion.profesor_guia_nombre }}</span>
              <span v-else class="text-muted">Sin asignar</span>
            </td>
            <td>
              <div class="acciones">
                <button
                  @click="verDetalleProfesores(seccion)"
                  class="btn-accion btn-ver"
                  title="Ver profesores"
                >
                  <font-awesome-icon :icon="['fas', 'users']" />
                </button>
                <button
                  @click="editarSeccion(seccion)"
                  class="btn-accion btn-editar"
                  title="Editar"
                >
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button
                  @click="confirmarEliminar(seccion)"
                  class="btn-accion btn-eliminar"
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

    <!-- Modal para crear/editar sección -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicion ? 'Editar sección' : 'Crear nueva sección' }}</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="guardarSeccion">
            <div class="form-group">
              <label for="nombreSeccion" class="form-label">Nombre de la sección:</label>
              <input
                type="text"
                id="nombreSeccion"
                v-model="seccionForm.nombre"
                class="form-control"
                required
                placeholder="Ej: A, B, C"
              />
            </div>
            
            <div class="form-group">
              <label for="gradoSeccion" class="form-label">Grado:</label>
              <input
                type="text"
                id="gradoSeccion"
                v-model="seccionForm.grado"
                class="form-control"
                required
                placeholder="Ej: Primer grado"
              />
            </div>
            
            <div class="form-group">
              <label for="anioLectivo" class="form-label">Año Lectivo:</label>
              <select
                id="anioLectivo"
                v-model="seccionForm.id_anio"
                class="form-control"
                required
              >
                <option value="" disabled>Seleccione un año lectivo</option>
                <option v-for="anio in aniosLectivos" :key="anio.id_anio" :value="anio.id_anio">
                  {{ anio.nombre }} ({{ formatFecha(anio.fecha_inicio) }} - {{ formatFecha(anio.fecha_fin) }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="profesorGuia" class="form-label">Profesor Guía:</label>
              <select
                id="profesorGuia"
                v-model="seccionForm.id_profesor_guia"
                class="form-control"
              >
                <option :value="null">Sin profesor guía asignado</option>
                <option v-for="profesor in profesores" :key="profesor.id_profesor" :value="profesor.id_profesor">
                  {{ profesor.nombre }} ({{ profesor.correo }})
                </option>
              </select>
              <small class="form-text text-muted">El profesor guía será el encargado principal de esta sección.</small>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="cerrarModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="cargando">
                {{ cargando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div class="modal-overlay" v-if="showConfirmModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Confirmar eliminación</h2>
          <button class="modal-close-btn" @click="cancelarEliminar">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content confirm-modal-content">
          <p class="confirm-message">
            ¿Está seguro que desea eliminar la sección <strong>{{ seccionAEliminar?.nombre }}</strong>?
            <br>
            Esta acción no se puede deshacer.
          </p>
          <div class="confirm-actions">
            <button @click="cancelarEliminar" class="btn-cancel">
              Cancelar
            </button>
            <button @click="eliminarSeccion" class="btn-confirm">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para ver profesores asignados a una sección -->
    <div class="modal-overlay" v-if="showProfesoresModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Profesores que imparten en {{ seccionSeleccionada?.nombre }}</h2>
          <button class="modal-close-btn" @click="cerrarDetalleProfesores">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <!-- Estado de carga -->
          <div v-if="cargando" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Cargando profesores...</p>
          </div>
          
          <!-- Lista de profesores -->
          <div v-else-if="profesoresSeccion.length > 0" class="profesores-list">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="profesor in profesoresSeccion" :key="profesor.id_profesor">
                  <td>{{ profesor.nombre }}</td>
                  <td>{{ profesor.correo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Mensaje si no hay profesores -->
          <div v-else class="empty-message">
            <p>No hay profesores asignados a esta sección.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div class="notification" v-if="notification.show" :class="notification.type">
      <div class="notification-icon">
        <font-awesome-icon :icon="notification.icon" />
      </div>
      <div class="notification-content">
        <p>{{ notification.message }}</p>
      </div>
      <button class="notification-close" @click="closeNotification">
        <font-awesome-icon icon="fa-xmark" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSecciones } from '@/composables/dashboards/direccion/useSecciones';
import AniosLectivosService, { type AnioLectivo } from '@/services/anios-lectivos.service';

// Estado para años lectivos
const aniosLectivos = ref<AnioLectivo[]>([]);

// Función para formatear fechas
const formatFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Cargar años lectivos
const cargarAniosLectivos = async () => {
  try {
    aniosLectivos.value = await AniosLectivosService.obtenerAniosLectivos();
  } catch (error) {
    console.error('Error al cargar años lectivos:', error);
  }
};

// Obtener todas las propiedades y métodos del composable
const {
  secciones,
  profesores,
  cargando,
  error,
  busqueda,
  showModal,
  showConfirmModal,
  showProfesoresModal,
  modoEdicion,
  seccionForm,
  seccionAEliminar,
  seccionSeleccionada,
  profesoresSeccion,
  notification,
  seccionesFiltradas,
  cargarSecciones,
  cargarProfesores,
  abrirModalCrear,
  editarSeccion,
  cerrarModal,
  guardarSeccion,
  confirmarEliminar,
  cancelarEliminar,
  eliminarSeccion,
  verDetalleProfesores,
  cerrarDetalleProfesores,
  showNotification,
  closeNotification
} = useSecciones();

onMounted(async () => {
  await cargarAniosLectivos();
});
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/secciones.css';
</style>
