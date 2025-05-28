<template>
  <div class="container">
    <!-- Componente de notificación -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
    <!-- Header section with title and add button -->
    <div class="header">
      <h1 class="title">Gestión de Padres de Familia</h1>
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
        <button v-if="searchTerm" @click="searchTerm = ''" class="search-clear-btn">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </div>

    <!-- Table of padres -->
    <div class="table-container">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="cargarPadres" class="btn btn-primary retry-btn">
          <font-awesome-icon :icon="['fas', 'sync']" /> Reintentar
        </button>
      </div>

      <div v-else class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Estudiantes Asociados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPadres.length === 0">
              <td colspan="4" class="empty-state">
                <p v-if="searchTerm">No se encontraron padres que coincidan con la búsqueda.</p>
                <p v-else>No hay padres registrados. Haga clic en "Agregar Padre" para comenzar.</p>
              </td>
            </tr>
            <tr v-for="padre in filteredPadres" :key="padre.id_usuario">
              <td>
                <div class="cell-content">
                  {{ padre.nombre }}
                  <span v-if="!padre.activo" class="status-badge inactive">Inactivo</span>
                  <span v-else class="status-badge active">Activo</span>
                </div>
              </td>
              <td>
                <div class="cell-content email">
                  {{ padre.correo || 'No registrado' }}
                </div>
              </td>
              <td>
                <div class="cell-content estudiantes">
                  <span v-if="padre.hijos && padre.hijos.length > 0">
                    <span
                      v-for="(hijo, index) in padre.hijos"
                      :key="hijo.id_estudiante"
                      class="estudiante-badge"
                    >
                      {{ hijo.nombre }}{{ index < padre.hijos.length - 1 ? ', ' : '' }}
                    </span>
                  </span>
                  <span v-else class="no-estudiantes">Sin estudiante asociado</span>
                </div>
              </td>
              <td class="actions-cell">
                <div class="actions-container">
                  <button @click="verDetalles(padre)" class="action-btn view" title="Ver detalles">
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button @click="openModal(padre)" class="action-btn edit" title="Editar">
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

          <form @submit.prevent="guardarPadre" class="modal-form">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                v-model="formData.nombre"
                class="form-input"
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>

            <div class="form-group">
              <label for="correo" class="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                v-model="formData.correo"
                class="form-input"
                placeholder="Ingrese el correo electrónico"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Estado</label>
              <div class="toggle-container">
                <label class="toggle">
                  <input type="checkbox" v-model="formData.activo" />
                  <span class="slider round"></span>
                </label>
                <span class="toggle-label">{{ formData.activo ? 'Activo' : 'Inactivo' }}</span>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Detalles del Padre -->
    <Teleport to="body">
      <div v-if="showDetallesModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Detalles del Padre</h2>
            <button @click="closeDetallesModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="detalles-content" v-if="padreSeleccionado">
            <div class="info-section">
              <h3 class="section-title">Información Personal</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">{{ padreSeleccionado.nombre }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Correo:</span>
                  <span class="info-value">{{ padreSeleccionado.correo || 'No registrado' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Estado:</span>
                  <span class="info-value">
                    <span
                      :class="
                        padreSeleccionado.activo ? 'status-badge active' : 'status-badge inactive'
                      "
                    >
                      {{ padreSeleccionado.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">Estudiantes Asociados</h3>
              <div
                v-if="padreSeleccionado.hijos && padreSeleccionado.hijos.length > 0"
                class="estudiantes-list"
              >
                <div
                  v-for="hijo in padreSeleccionado.hijos"
                  :key="hijo.id_estudiante"
                  class="estudiante-card"
                >
                  <div class="estudiante-info">
                    <span class="estudiante-nombre">{{ hijo.nombre }}</span>
                    <span class="estudiante-id">ID: {{ hijo.id_estudiante }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="no-estudiantes-message">
                <p>Este padre no tiene estudiantes asociados.</p>
              </div>
            </div>

            <div class="modal-actions">
              <button @click="openModal(padreSeleccionado)" class="btn btn-primary">
                <font-awesome-icon :icon="['fas', 'pen']" />
                Editar
              </button>
              <button @click="confirmarEliminar(padreSeleccionado)" class="btn btn-danger">
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
                Eliminar
              </button>
              <button @click="closeDetallesModal" class="btn btn-secondary">Cerrar</button>
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
              ¿Está seguro que desea eliminar a
              <span class="font-bold">{{ padreAEliminar?.nombre }}</span
              >?
              <br />
              <span class="text-danger">Esta acción no se puede deshacer.</span>
            </p>

            <div class="confirm-actions">
              <button @click="showConfirmDialog = false" class="btn btn-secondary">Cancelar</button>
              <button @click="eliminarPadre" class="btn btn-danger">Eliminar</button>
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
  padres,
  formData,
  showModal,
  isEditing,
  showDetallesModal,
  padreSeleccionado,
  showConfirmDialog,
  padreAEliminar,
  searchTerm,
  filteredPadres,
  isLoading,
  error,
  notification,

  // Métodos
  openModal,
  closeModal,
  verDetalles,
  closeDetallesModal,
  guardarPadre,
  confirmarEliminar,
  eliminarPadre,
  cargarPadres,
} = useGestionPadres()
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/gestionpadres.css';
</style>
