<template>
  <div class="container">
    <!-- Header section with title only -->
    <div class="header">
      <h1 class="title">Años Lectivos</h1>
    </div>
    
    <!-- Info banner -->
    <div class="info-banner">
      <font-awesome-icon :icon="['fas', 'info-circle']" class="info-icon" />
      <span>Para crear un nuevo año lectivo, utilice la opción <strong>"Crear Año"</strong> en el menú de navegación.</span>
      <router-link :to="{ name: 'direccion-anios-crear' }" class="info-link">
        Ir a Crear Año
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
      </router-link>
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
            <tr v-for="anio in filteredAnios" :key="anio.id">
              <td>
                <div class="cell-content font-bold">{{ anio.anio }}</div>
              </td>
              <td>
                <div class="cell-content">{{ formatearFecha(anio.fechaInicio) }}</div>
              </td>
              <td>
                <div class="cell-content">{{ formatearFecha(anio.fechaFin) }}</div>
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
                    <font-awesome-icon :icon="['fas', 'trash-alt']" />
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
              <label for="anio" class="form-label">Año *</label>
              <input 
                type="number" 
                id="anio" 
                v-model="formData.anio" 
                class="form-input" 
                placeholder="Ingrese el año"
                min="2000"
                max="2100"
                required
              />
            </div>

            <div class="form-group">
              <label for="fechaInicio" class="form-label">Fecha de Inicio *</label>
              <input 
                type="date" 
                id="fechaInicio" 
                v-model="formData.fechaInicio" 
                class="form-input" 
                required
              />
            </div>

            <div class="form-group">
              <label for="fechaFin" class="form-label">Fecha de Finalización *</label>
              <input 
                type="date" 
                id="fechaFin" 
                v-model="formData.fechaFin" 
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

          <div class="details-container" v-if="selectedAnio">
            <div class="details-group">
              <div class="details-label">Año</div>
              <div class="details-value">{{ selectedAnio.anio }}</div>
            </div>

            <div class="details-group">
              <div class="details-label">Fecha de Inicio</div>
              <div class="details-value">{{ formatearFecha(selectedAnio.fechaInicio) }}</div>
            </div>

            <div class="details-group">
              <div class="details-label">Fecha de Finalización</div>
              <div class="details-value">{{ formatearFecha(selectedAnio.fechaFin) }}</div>
            </div>

            <div class="details-group">
              <div class="details-label">Estado</div>
              <div class="status-badge" :class="selectedAnio.activo ? 'active' : 'inactive'">
                <font-awesome-icon 
                  v-if="selectedAnio.activo" 
                  :icon="['fas', 'check-circle']" 
                  class="icon" 
                />
                {{ selectedAnio.activo ? 'Activo' : 'Inactivo' }}
              </div>
            </div>

            <div class="details-actions">
              <button 
                v-if="!selectedAnio.activo"
                @click="marcarComoActivo(selectedAnio)" 
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
      <div v-if="showConfirmDialog" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Confirmar Eliminación</h2>
            <button @click="showConfirmDialog = false" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="confirm-dialog">
            <p class="confirm-message">
              ¿Está seguro que desea eliminar el año lectivo <span class="font-bold">{{ anioAEliminar?.anio }}</span>?
              <br>
              <span class="text-danger">Esta acción no se puede deshacer.</span>
            </p>

            <div class="confirm-actions">
              <button 
                @click="showConfirmDialog = false" 
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                @click="eliminarAnio" 
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useGestionAnios from '@/composables/dashboards/direccion/useGestionAnios'

const {
  // Estado
  formData,
  showModal,
  isEditing,
  showConfirmDialog,
  anioAEliminar,
  showDetailsModal,
  selectedAnio,
  searchTerm,
  filteredAnios,
  
  // Métodos
  formatearFecha,
  verAnio,
  closeDetailsModal,
  openModal,
  editarDesdeDetalles,
  closeModal,
  guardarAnio,
  confirmarEliminar,
  eliminarAnio,
  marcarComoActivo
} = useGestionAnios()

// No necesitamos la función irACrearAnio ya que ahora usamos router-link
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionanios.css';

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

/* Corregir posición del header */
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

/* Estilos para el banner informativo */
.info-banner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
}
</style>
