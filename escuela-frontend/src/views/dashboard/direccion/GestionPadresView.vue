<template>
  <div class="container">
    <!-- Header section with title and add button -->
    <div class="header">
      <h1 class="title">Gestión de Padres de Familia</h1>
      <button 
        @click="openModal(null)" 
        class="btn btn-primary add-button"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        Agregar Padre
      </button>
    </div>

    <!-- Search bar -->
    <div class="search-container">
      <div class="search-bar">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar por nombre o correo electrónico..." 
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

    <!-- Table of padres -->
    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPadres.length === 0">
              <td colspan="3" class="empty-state">
                <p v-if="searchTerm">No se encontraron padres que coincidan con la búsqueda.</p>
                <p v-else>No hay padres registrados. Haga clic en "Agregar Padre" para comenzar.</p>
              </td>
            </tr>
            <tr v-for="padre in filteredPadres" :key="padre.id">
              <td>
                <div class="cell-content">{{ padre.nombreCompleto }}</div>
              </td>
              <td>
                <div class="cell-content email">
                  {{ padre.email || 'No registrado' }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    @click="openModal(padre)" 
                    class="action-btn edit" 
                    title="Editar"
                  >
                    <font-awesome-icon :icon="['fas', 'pen']" />
                  </button>
                  <button 
                    @click="confirmarEliminar(padre)" 
                    class="action-btn delete" 
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
    </div>

    <!-- Modal para Crear/Editar Padre -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ isEditing ? 'Editar Padre' : 'Agregar Padre' }}
            </h2>
            <button @click="closeModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="modal-form">
            <div class="form-group">
              <label for="nombreCompleto" class="form-label">Nombre Completo *</label>
              <input 
                type="text" 
                id="nombreCompleto" 
                v-model="formData.nombreCompleto" 
                class="form-input" 
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                class="form-input" 
                placeholder="Ingrese el correo electrónico (opcional)"
              />
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
                @click="guardarPadre" 
                class="btn btn-primary"
              >
                Guardar
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
              ¿Está seguro que desea eliminar a <span class="font-bold">{{ padreAEliminar?.nombreCompleto }}</span>?
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
                @click="eliminarPadre" 
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
import useGestionPadres from '@/composables/dashboards/direccion/useGestionPadres'

const {
  // Estado
  formData,
  showModal,
  isEditing,
  showConfirmDialog,
  padreAEliminar,
  searchTerm,
  filteredPadres,
  
  // Métodos
  openModal,
  closeModal,
  guardarPadre,
  confirmarEliminar,
  eliminarPadre
} = useGestionPadres()
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionpadres.css';

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
</style>
