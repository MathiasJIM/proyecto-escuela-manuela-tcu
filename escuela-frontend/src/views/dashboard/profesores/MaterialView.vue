<template>
  <div class="material-view">
    <header class="dashboard-header">
      <h1>Materiales de Apoyo</h1>
      <p class="page-description">Gestione los recursos educativos para sus estudiantes</p>
    </header>

    <!-- Formulario para agregar/editar material -->
    <div class="dashboard-card-section">
      <div class="section-header" @click="toggleFormularioVisible" style="cursor: pointer;">
        <div class="header-content">
          <h2>
            <font-awesome-icon :icon="editandoMaterial ? 'edit' : 'plus-circle'" />
            {{ editandoMaterial ? 'Editar Material' : 'Nuevo Material' }}
          </h2>
          <div class="section-actions">
            <button class="toggle-button" :class="{ collapsed: !formularioVisible }">
              <font-awesome-icon icon="chevron-down" />
            </button>
          </div>
        </div>
      </div>
      <div v-show="formularioVisible" class="section-content">
        <form @submit.prevent="guardarMaterial" class="material-form">
          <div class="form-group">
            <label for="titulo">Título del recurso*</label>
            <input
              type="text"
              id="titulo"
              v-model="formulario.titulo"
              class="form-control"
              required
              placeholder="Ej: Guía de ejercicios matemáticos"
            />
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              v-model="formulario.descripcion"
              class="form-control"
              rows="3"
              placeholder="Descripción breve del material (opcional)"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="enlace">Enlace*</label>
            <input
              type="url"
              id="enlace"
              v-model="formulario.enlace"
              class="form-control"
              required
              placeholder="https://ejemplo.com/recurso"
            />
            <small v-if="errores.enlace" class="error-text">{{ errores.enlace }}</small>
          </div>

          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="grupo">Grupo/Sección*</label>
              <select id="grupo" v-model="formulario.grupo" class="form-control" required>
                <option value="" disabled selected>Seleccione un grupo</option>
                <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.id">
                  {{ grupo.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group form-group-half">
              <label for="materia">Materia</label>
              <select id="materia" v-model="formulario.materia" class="form-control">
                <option value="" disabled selected>Seleccione una materia (opcional)</option>
                <option v-for="materia in materias" :key="materia.id" :value="materia.id">
                  {{ materia.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button
              v-if="editandoMaterial"
              type="button"
              class="btn btn-secondary"
              @click="cancelarEdicion"
            >
              <font-awesome-icon icon="times" /> Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <font-awesome-icon :icon="editandoMaterial ? 'save' : 'plus'" />
              {{ editandoMaterial ? 'Actualizar' : 'Agregar' }} recurso
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sección combinada de búsqueda y materiales -->
    <div class="dashboard-card-section">
      <div class="section-header" @click="toggleMaterialesVisible" style="cursor: pointer;">
        <div class="header-content">
          <h2>
            <font-awesome-icon icon="book" />
            Materiales Disponibles
          </h2>
          <div class="section-actions">
            <button class="toggle-button" :class="{ collapsed: !materialesVisible }">
              <font-awesome-icon icon="chevron-down" />
            </button>
          </div>
        </div>
        <p class="section-description">
          {{ materialesFiltrados.length }} recursos encontrados
        </p>
      </div>
      <div v-show="materialesVisible" class="section-content">
        <!-- Filtros y búsqueda -->
        <div class="filtros-container">
          <div class="filtro-grupo">
            <input
              type="text"
              v-model="filtros.busqueda"
              class="form-control"
              placeholder="Buscar por título..."
            />
          </div>
          <div class="filtro-grupo">
            <select v-model="filtros.grupo" class="form-control">
              <option value="">Todos los grupos</option>
              <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.id">
                {{ grupo.nombre }}
              </option>
            </select>
          </div>
          <button class="btn btn-outline" @click="limpiarFiltros">
            <font-awesome-icon icon="filter-circle-xmark" /> Limpiar filtros
          </button>
        </div>
        
        <!-- Listado de materiales -->
        <div v-if="materialesFiltrados.length === 0" class="empty-state">
          <font-awesome-icon icon="folder-open" class="empty-icon" />
          <p>No hay recursos disponibles</p>
          <small v-if="tieneFiltroBusqueda">Prueba con otros criterios de búsqueda</small>
        </div>

        <div v-else class="materiales-grid">
          <div v-for="material in materialesFiltrados" :key="material.id" class="material-card">
            <!-- Encabezado con título y acciones -->
            <div class="material-header">
              <div class="material-title-container">
                <h3>{{ material.titulo }}</h3>
              </div>
              <div class="material-actions">
                <button class="btn-icon" @click="editarMaterial(material)" title="Editar material">
                  <font-awesome-icon icon="edit" />
                </button>
                <button class="btn-icon" @click="confirmarEliminar(material)" title="Eliminar material">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </div>
            
            <!-- Descripción del material -->
            <div class="material-content">
              <p v-if="material.descripcion" class="material-descripcion">
                {{ material.descripcion }}
              </p>
              <p v-else class="material-descripcion material-descripcion-empty">
                Sin descripción
              </p>
            </div>
            
            <!-- Metadatos del material -->
            <div class="material-meta">
              <span class="meta-item">
                <font-awesome-icon icon="users" />
                {{ obtenerNombreGrupo(material.grupo) }}
              </span>
              <span v-if="material.materia" class="meta-item">
                <font-awesome-icon icon="book-open" />
                {{ obtenerNombreMateria(material.materia) }}
              </span>
              <span class="meta-item">
                <font-awesome-icon icon="calendar" />
                {{ formatearFecha(material.fechaPublicacion) }}
              </span>
            </div>
            
            <!-- Pie con enlace al recurso -->
            <div class="material-footer">
              <a :href="material.enlace" target="_blank" rel="noopener noreferrer" class="btn-link">
                <font-awesome-icon icon="external-link-alt" /> Abrir recurso
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMaterial } from '@/composables/dashboards/profesores/useMaterial'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const {
  // Datos
  grupos,
  materias,
  // Estado del formulario
  formulario,
  errores,
  editandoMaterial,
  // Filtros
  filtros,
  // Computed properties
  materialesFiltrados,
  tieneFiltroBusqueda,
  // Métodos
  guardarMaterial,
  editarMaterial,
  cancelarEdicion,
  confirmarEliminar,
  limpiarFiltros,
  obtenerNombreGrupo,
  obtenerNombreMateria,
  formatearFecha,
  // Estado de visibilidad
  materialesVisible,
  formularioVisible,
  toggleMaterialesVisible,
  toggleFormularioVisible
} = useMaterial()
</script>

<style scoped>
@import '@/assets/styles/dashboards/profesores/material.css';
</style>
