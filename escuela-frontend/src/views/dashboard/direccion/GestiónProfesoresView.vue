<template>
  <div class="container">
    <!-- Header section with title and add button -->
    <div class="header">
      <h1 class="title">Gestión de Profesores</h1>
      <button 
        @click="openModal(null)" 
        class="btn btn-primary add-button"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        Agregar Profesor
      </button>
    </div>

    <!-- Search bar -->
    <div class="search-container">
      <div class="search-bar">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar profesor por nombre o correo..." 
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
              <th>Correo Electrónico</th>
              <th>Materias</th>
              <th>Secciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="profesor in filteredProfesores" :key="profesor.id" class="table-row">
              <td>
                <div class="cell-content">{{ profesor.nombreCompleto }}</div>
              </td>
              <td>
                <div class="cell-content email">{{ profesor.email }}</div>
              </td>
              <td>
                <div class="cell-content">
                  {{ formatMaterias(profesor.materias) }}
                </div>
              </td>
              <td>
                <div class="cell-content">
                  {{ formatSecciones(profesor.secciones) }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    @click="verProfesor(profesor)" 
                    class="btn-action btn-view"
                    title="Ver detalles"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button 
                    @click="openModal(profesor)" 
                    class="btn-action btn-edit"
                    title="Editar"
                  >
                    <font-awesome-icon :icon="['fas', 'pen']" />
                  </button>
                  <button 
                    @click="confirmarEliminar(profesor)" 
                    class="btn-action btn-delete"
                    title="Eliminar"
                  >
                    <font-awesome-icon :icon="['fas', 'trash-alt']" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty state -->
            <tr v-if="filteredProfesores.length === 0">
              <td colspan="5" class="empty-state">
                {{ profesores.length === 0 ? 'No hay profesores registrados. Haga clic en "Agregar Profesor" para comenzar.' : 'No se encontraron profesores que coincidan con la búsqueda.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Crear/Editar Profesor -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ isEditing ? 'Editar Profesor' : 'Agregar Nuevo Profesor' }}
            </h2>
            <button @click="closeModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <form @submit.prevent="guardarProfesor" class="modal-form">
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

            <!-- Correo electrónico -->
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                class="form-control"
                required
              />
            </div>

            <!-- Materias (select múltiple con chips) -->
            <div class="form-group">
              <label for="materias">Materias</label>
              <div class="select-container">
                <div class="select-with-button">
                  <select 
                    id="materias" 
                    v-model="selectedMateria" 
                    class="form-control"
                  >
                    <option value="" disabled selected>Seleccionar materia</option>
                    <option v-for="materia in materiasDisponibles" :key="materia.id" :value="materia">
                      {{ materia.nombre }}
                    </option>
                  </select>
                  <button 
                    type="button" 
                    @click="agregarMateria" 
                    class="btn-add"
                    :disabled="!selectedMateria"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </button>
                </div>
              </div>
              <!-- Chips de materias seleccionadas -->
              <div class="chips-container">
                <div 
                  v-for="(materia, index) in formData.materias" 
                  :key="index"
                  class="chip chip-blue"
                >
                  {{ materia.nombre }}
                  <button 
                    type="button" 
                    @click="eliminarMateria(index)" 
                    class="chip-delete-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Secciones (select múltiple) -->
            <div class="form-group">
              <label for="secciones">Secciones</label>
              <div class="select-container">
                <div class="select-with-button">
                  <select 
                    id="secciones" 
                    v-model="selectedSeccion" 
                    class="form-control"
                  >
                    <option value="" disabled selected>Seleccionar sección</option>
                    <option v-for="seccion in seccionesDisponibles" :key="seccion.id" :value="seccion">
                      {{ seccion.nombre }}
                    </option>
                  </select>
                  <button 
                    type="button" 
                    @click="agregarSeccion" 
                    class="btn-add"
                    :disabled="!selectedSeccion"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </button>
                </div>
              </div>
              <!-- Chips de secciones seleccionadas -->
              <div class="chips-container">
                <div 
                  v-for="(seccion, index) in formData.secciones" 
                  :key="index"
                  class="chip chip-green"
                >
                  {{ seccion.nombre }}
                  <button 
                    type="button" 
                    @click="eliminarSeccion(index)" 
                    class="chip-delete-btn"
                  >
                    <font-awesome-icon :icon="['fas', 'xmark']" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
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
                <font-awesome-icon :icon="['fas', 'save']" />
                Guardar
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
          <div class="confirm-dialog-content">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="warning-icon" />
            <h3 class="confirm-title">Confirmar Eliminación</h3>
            <p class="confirm-message">
              ¿Está seguro que desea eliminar al profesor <span class="text-bold">{{ profesorAEliminar?.nombreCompleto }}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div class="confirm-actions">
              <button 
                @click="showConfirmDialog = false" 
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                @click="eliminarProfesor" 
                class="btn btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Detalles del Profesor -->
    <Teleport to="body">
      <div v-if="showDetailsModal" class="modal-overlay">
        <div class="details-modal">
          <div class="details-header">
            <h2 class="details-title">Detalles del Profesor</h2>
            <button @click="closeDetailsModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="details-content" v-if="selectedProfesor">
            <div class="details-section">
              <div class="details-avatar">
                <font-awesome-icon :icon="['fas', 'user-tie']" class="avatar-icon" />
              </div>
              <div class="details-info">
                <h3 class="profesor-name">{{ selectedProfesor.nombreCompleto }}</h3>
                <p class="profesor-email">
                  <font-awesome-icon :icon="['fas', 'envelope']" />
                  {{ selectedProfesor.email }}
                </p>
              </div>
            </div>

            <div class="details-section">
              <h4 class="section-title">
                <font-awesome-icon :icon="['fas', 'book']" />
                Materias Asignadas
              </h4>
              <div class="details-chips">
                <div v-if="selectedProfesor.materias.length === 0" class="empty-message">
                  No tiene materias asignadas
                </div>
                <div 
                  v-for="materia in selectedProfesor.materias" 
                  :key="materia.id"
                  class="details-chip"
                >
                  {{ materia.nombre }}
                </div>
              </div>
            </div>

            <div class="details-section">
              <h4 class="section-title">
                <font-awesome-icon :icon="['fas', 'users']" />
                Secciones Asignadas
              </h4>
              <div class="details-chips">
                <div v-if="selectedProfesor.secciones.length === 0" class="empty-message">
                  No tiene secciones asignadas
                </div>
                <div 
                  v-for="seccion in selectedProfesor.secciones" 
                  :key="seccion.id"
                  class="details-chip"
                >
                  {{ seccion.nombre }}
                </div>
              </div>
            </div>

            <div class="details-actions">
              <button 
                @click="editarDesdeDetalles()" 
                class="btn btn-primary details-btn"
              >
                <font-awesome-icon :icon="['fas', 'pen']" />
                Editar Profesor
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionprofes.css';
</style>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useGestionProfes from '@/composables/dashboards/direccion/useGestionProfes'

const {
  // Estado
  profesores,
  formData,
  showModal,
  isEditing,
  showConfirmDialog,
  profesorAEliminar,
  showDetailsModal,
  selectedProfesor,
  searchTerm,
  materiasDisponibles,
  seccionesDisponibles,
  selectedMateria,
  selectedSeccion,
  filteredProfesores,
  
  // Métodos
  formatMaterias,
  formatSecciones,
  openModal,
  closeModal,
  agregarMateria,
  eliminarMateria,
  agregarSeccion,
  eliminarSeccion,
  guardarProfesor,
  verProfesor,
  closeDetailsModal,
  editarDesdeDetalles,
  confirmarEliminar,
  eliminarProfesor
} = useGestionProfes()
</script>
