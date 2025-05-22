<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Materias</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear nueva materia
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-group">
        <div class="search-container">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar por nombre..."
            class="search-input"
          />
          <font-awesome-icon icon="fa-search" class="search-icon" />
        </div>
      </div>
      <div class="filter-info">
        <span>{{ materiasFiltradas.length }} materias encontradas</span>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando materias...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="cargarMaterias" class="btn btn-primary">Reintentar</button>
    </div>

    <!-- Tabla de materias -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-nombre">Nombre de la materia</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="materiasFiltradas.length === 0">
            <td colspan="2" class="empty-message">
              No se encontraron materias. Crea una nueva materia para comenzar.
            </td>
          </tr>
          <tr v-for="materia in materiasFiltradas" :key="materia.id_materia">
            <td class="materia-nombre">{{ materia.nombre }}</td>
            <td>
              <div class="acciones">
                <button
                  @click="verDetalleProfesores(materia)"
                  class="btn-accion btn-ver"
                  title="Ver profesores"
                >
                  <font-awesome-icon :icon="['fas', 'users']" />
                </button>
                <button
                  @click="editarMateria(materia)"
                  class="btn-accion btn-editar"
                  title="Editar"
                >
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button
                  @click="confirmarEliminar(materia)"
                  class="btn-accion btn-eliminar"
                  title="Eliminar"
                >
                  <font-awesome-icon :icon="['fas', 'trash-alt']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar materia -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicion ? 'Editar materia' : 'Crear nueva materia' }}</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="guardarMateria">
            <div class="form-group">
              <label for="nombreMateria" class="form-label">Nombre de la materia:</label>
              <input
                type="text"
                id="nombreMateria"
                v-model="materiaForm.nombre"
                class="form-control"
                required
                placeholder="Ej: Matemáticas"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-primary" @click="guardarMateria" :disabled="!materiaForm.nombre">
            {{ modoEdicion ? 'Guardar cambios' : 'Crear materia' }}
          </button>
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
            ¿Está seguro que desea eliminar la materia
            <strong>{{ materiaAEliminar?.nombre }}</strong>?
          </p>
          <p class="warning-message">
            <font-awesome-icon icon="fa-triangle-exclamation" />
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEliminar">Cancelar</button>
          <button class="btn btn-danger" @click="eliminarMateria">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal para ver profesores asignados a una materia -->
    <div class="modal-overlay" v-if="showProfesoresModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Profesores que imparten {{ materiaSeleccionada?.nombre }}</h2>
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
          <div v-else-if="profesoresMateria.length > 0" class="profesores-list">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="profesor in profesoresMateria" :key="profesor.id_profesor">
                  <td>{{ profesor.nombre }}</td>
                  <td>{{ profesor.correo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Mensaje si no hay profesores -->
          <div v-else class="empty-message">
            <p>No hay profesores asignados a esta materia.</p>
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
        {{ notification.message }}
      </div>
      <button class="notification-close" @click="closeNotification">
        <font-awesome-icon icon="fa-xmark" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMaterias } from '@/composables/dashboards/direccion/useMaterias';

// Obtener todas las propiedades y métodos del composable
const {
  materias,
  cargando,
  error,
  busqueda,
  showModal,
  showConfirmModal,
  showProfesoresModal,
  modoEdicion,
  materiaForm,
  materiaAEliminar,
  materiaSeleccionada,
  profesoresMateria,
  notification,
  materiasFiltradas,
  cargarMaterias,
  abrirModalCrear,
  editarMateria,
  cerrarModal,
  guardarMateria,
  confirmarEliminar,
  cancelarEliminar,
  eliminarMateria,
  verDetalleProfesores,
  cerrarDetalleProfesores,
  showNotification,
  closeNotification
} = useMaterias();
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/materias.css';
</style>
