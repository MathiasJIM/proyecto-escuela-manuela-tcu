<template>
  <div class="container">
    <h1 class="title">Promocionar Estudiantes</h1>
    
    <!-- Selectores de año origen y destino -->
    <div class="year-selectors">
      <div class="selector-group">
        <label for="anioOrigen" class="selector-label">Año de Origen</label>
        <select 
          id="anioOrigen" 
          v-model="anioOrigenId" 
          class="selector"
          @change="(e) => seleccionarAnioOrigen(Number((e.target as HTMLSelectElement).value))"
        >
          <option value="" disabled selected>Seleccione un año</option>
          <option 
            v-for="anio in aniosDisponiblesOrigen" 
            :key="anio.id" 
            :value="anio.id"
          >
            {{ anio.anio }}
          </option>
        </select>
        <div class="selector-help">Seleccione el año lectivo desde el cual desea promocionar estudiantes.</div>
      </div>
      
      <div class="selector-group">
        <label for="anioDestino" class="selector-label">Año de Destino</label>
        <select 
          id="anioDestino" 
          v-model="anioDestinoId" 
          class="selector"
          @change="(e) => seleccionarAnioDestino(Number((e.target as HTMLSelectElement).value))"
          :disabled="!anioOrigenId"
        >
          <option value="" disabled selected>Seleccione un año</option>
          <option 
            v-for="anio in aniosDisponiblesDestino" 
            :key="anio.id" 
            :value="anio.id"
          >
            {{ anio.anio }}{{ anio.activo ? ' (Activo)' : '' }}
          </option>
        </select>
        <div class="selector-help">Seleccione el año lectivo al cual desea promocionar los estudiantes.</div>
      </div>
    </div>
    
    <!-- Mensajes de error -->
    <div v-if="errores.length > 0" class="error-container">
      <div class="error-title">
        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" /> 
        Hay errores que debe corregir:
      </div>
      <ul class="error-list">
        <li v-for="(error, index) in errores" :key="index" class="error-item">
          {{ error }}
        </li>
      </ul>
    </div>
    
    <!-- Tabla de secciones -->
    <div v-if="anioOrigen && anioDestino" class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Sección</th>
              <th>Estudiantes</th>
              <th>Sección Destino</th>
              <th>Promocionar Todos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="seccionesOrigen.length === 0">
              <td colspan="4" class="text-center">
                No hay secciones disponibles en el año seleccionado.
              </td>
            </tr>
            <tr v-for="seccion in seccionesOrigen" :key="seccion.id">
              <td>
                <div class="cell-content">{{ seccion.nombre }}</div>
              </td>
              <td>
                <div class="cell-count">
                  <span class="count-badge" :class="{ 'selected': estudiantesSeleccionados(seccion.id) > 0 }">
                    {{ estudiantesSeleccionados(seccion.id) }}
                  </span>
                  <span>de {{ seccion.estudiantes.length }}</span>
                </div>
              </td>
              <td>
                <select 
                  v-model="seccion.seccionDestinoId" 
                  class="destination-selector"
                >
                  <option value="" disabled selected>Seleccione sección destino</option>
                  <option 
                    v-for="seccionDestino in seccionesDestino" 
                    :key="seccionDestino.id" 
                    :value="seccionDestino.id"
                  >
                    {{ seccionDestino.nombre }}
                  </option>
                </select>
              </td>
              <td>
                <div class="promote-checkbox">
                  <input 
                    type="checkbox" 
                    :id="'promocionar-todos-' + seccion.id" 
                    v-model="seccion.promocionarTodos" 
                    class="checkbox-input"
                    @change="(e) => cambiarPromocionarTodos(seccion.id, (e.target as HTMLInputElement).checked)"
                  />
                  <label :for="'promocionar-todos-' + seccion.id" class="checkbox-label">
                    Todos
                  </label>
                  <button 
                    v-if="!seccion.promocionarTodos" 
                    @click="abrirModalEstudiantes(seccion.id)" 
                    class="select-students-btn"
                  >
                    Seleccionar estudiantes
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Botones de acción -->
    <div class="actions">
      <button 
        @click="resetearFormulario" 
        class="btn btn-secondary"
      >
        <font-awesome-icon :icon="['fas', 'times']" />
        Cancelar
      </button>
      <button 
        @click="promocionarEstudiantes" 
        class="btn btn-primary"
        :disabled="!puedePromocionar || !anioOrigen || !anioDestino"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
        Promocionar Estudiantes
      </button>
    </div>
    
    <!-- Modal de selección de estudiantes -->
    <Teleport to="body">
      <div v-if="showEstudiantesModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              Seleccionar Estudiantes - Sección {{ seccionSeleccionada?.nombre }}
            </h2>
            <button @click="cerrarModalEstudiantes" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="modal-content">
            <div class="select-actions">
              <button @click="seleccionarTodosEstudiantes" class="select-all-btn">
                <font-awesome-icon :icon="['fas', 'check']" /> Seleccionar Todos
              </button>
              <button @click="deseleccionarTodosEstudiantes" class="deselect-all-btn">
                <font-awesome-icon :icon="['fas', 'times']" /> Deseleccionar Todos
              </button>
            </div>
            
            <div class="students-list">
              <div 
                v-for="estudiante in seccionSeleccionada?.estudiantes" 
                :key="estudiante.id" 
                class="student-item"
              >
                <input 
                  type="checkbox" 
                  :id="'estudiante-' + estudiante.id" 
                  v-model="estudiante.seleccionado" 
                  class="student-checkbox"
                  @change="toggleEstudiante(estudiante.id)"
                />
                <label :for="'estudiante-' + estudiante.id" class="student-name">
                  {{ estudiante.nombreCompleto }}
                </label>
              </div>
            </div>
            
            <div class="modal-actions">
              <button @click="cerrarModalEstudiantes" class="btn btn-secondary">
                Cerrar
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
import usePromocionarEstudiantes from '@/composables/dashboards/direccion/usePromocionarEstudiantes'

const {
  // Estado
  anioOrigenId,
  anioDestinoId,
  showEstudiantesModal,
  seccionSeleccionada,
  
  // Computed
  anioOrigen,
  anioDestino,
  seccionesOrigen,
  seccionesDestino,
  aniosDisponiblesOrigen,
  aniosDisponiblesDestino,
  errores,
  puedePromocionar,
  
  // Métodos
  seleccionarAnioOrigen,
  seleccionarAnioDestino,
  cambiarPromocionarTodos,
  abrirModalEstudiantes,
  cerrarModalEstudiantes,
  toggleEstudiante,
  seleccionarTodosEstudiantes,
  deseleccionarTodosEstudiantes,
  promocionarEstudiantes,
  estudiantesSeleccionados,
  resetearFormulario
} = usePromocionarEstudiantes()
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/promocionarestudiantes.css';

/* Estilos específicos para corregir el ancho */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
}

.year-selectors {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
}

.error-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
}
</style>
