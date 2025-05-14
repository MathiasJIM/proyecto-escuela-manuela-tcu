<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Gestión de Secciones</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Crear Nueva Sección
      </button>
    </div>

    <div class="filters-container">
      <div class="filter-group">
        <label for="anioLectivo" class="filter-label">Año Lectivo:</label>
        <select 
          id="anioLectivo" 
          v-model="anioLectivoSeleccionado" 
          class="filter-select"
          @change="filtrarSecciones"
        >
          <option value="">Todos los años</option>
          <option 
            v-for="anio in aniosLectivos" 
            :key="anio.id" 
            :value="anio.id"
          >
            {{ anio.anio }} {{ anio.activo ? '(Activo)' : '' }}
          </option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Profesor Guía</th>
              <th>Estudiantes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="seccionesFiltradas.length === 0">
              <td colspan="4" class="text-center">No hay secciones disponibles</td>
            </tr>
            <tr v-for="seccion in seccionesFiltradas" :key="seccion.id">
              <td>
                <div class="cell-content">{{ seccion.nombre }}</div>
              </td>
              <td>
                <div class="cell-content">
                  {{ seccion.profesorGuia ? seccion.profesorGuia.nombre : 'No asignado' }}
                </div>
              </td>
              <td>
                <div class="cell-content">
                  <span class="badge badge-blue">{{ seccion.estudiantes.length }}</span>
                </div>
              </td>
              <td>
                <div class="acciones">
                  <button @click="verDetalles(seccion)" class="btn-accion btn-ver" title="Ver detalles">
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                  <button @click="editarSeccion(seccion)" class="btn-accion btn-editar" title="Editar">
                    <font-awesome-icon :icon="['fas', 'pen']" />
                  </button>
                  <button @click="confirmarEliminar(seccion)" class="btn-accion btn-eliminar" title="Eliminar">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para crear/editar sección -->
    <Teleport to="body">
      <div v-if="showFormModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ modoEdicion ? 'Editar' : 'Crear' }} Sección
            </h2>
            <button @click="cerrarModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="modal-content">
            <form @submit.prevent="guardarSeccion">
              <div class="form-group">
                <label for="nombreSeccion" class="form-label">Nombre de la Sección</label>
                <input 
                  type="text" 
                  id="nombreSeccion" 
                  v-model="seccionForm.nombre" 
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="anioLectivoSeccion" class="form-label">Año Lectivo</label>
                <select 
                  id="anioLectivoSeccion" 
                  v-model="seccionForm.anioLectivoId" 
                  class="form-select"
                  required
                >
                  <option value="" disabled>Seleccione un año lectivo</option>
                  <option 
                    v-for="anio in aniosLectivos" 
                    :key="anio.id" 
                    :value="anio.id"
                  >
                    {{ anio.anio }} {{ anio.activo ? '(Activo)' : '' }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="profesorGuia" class="form-label">Profesor Guía</label>
                <select 
                  id="profesorGuia" 
                  v-model="seccionForm.profesorGuiaId" 
                  class="form-select"
                >
                  <option value="">Sin profesor guía</option>
                  <option 
                    v-for="profesor in profesores" 
                    :key="profesor.id" 
                    :value="profesor.id"
                  >
                    {{ profesor.nombre }}
                  </option>
                </select>
              </div>
              

            </form>
          </div>
          
          <div class="modal-footer">
            <button @click="cerrarModal" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="guardarSeccion" class="btn btn-primary">
              {{ modoEdicion ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal para ver detalles de sección -->
    <Teleport to="body">
      <div v-if="showDetallesModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              Detalles de Sección: {{ seccionSeleccionada?.nombre }}
            </h2>
            <button @click="cerrarModalDetalles" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="modal-content">
            <div class="detail-card">
              <div class="detail-header">
                <h3 class="detail-title">Información General</h3>
              </div>
              <div class="detail-content">
                <div class="detail-group">
                  <div class="detail-label">Nombre</div>
                  <div class="detail-value">{{ seccionSeleccionada?.nombre }}</div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Año Lectivo</div>
                  <div class="detail-value">
                    {{ obtenerNombreAnioLectivo(seccionSeleccionada?.anioLectivoId) }}
                  </div>
                </div>
                <div class="detail-group">
                  <div class="detail-label">Profesor Guía</div>
                  <div class="detail-value">
                    {{ seccionSeleccionada?.profesorGuia?.nombre || 'No asignado' }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="detail-card">
              <div class="detail-header">
                <h3 class="detail-title">Estudiantes</h3>
              </div>
              <div class="detail-content">
                <div v-if="seccionSeleccionada?.estudiantes.length === 0" class="detail-group">
                  No hay estudiantes asignados a esta sección.
                </div>
                <ul v-else class="detail-list">
                  <li v-for="estudiante in seccionSeleccionada?.estudiantes" :key="estudiante.id" class="detail-list-item">
                    <div>
                      <div class="detail-list-title">{{ estudiante.nombre }}</div>
                      <div class="detail-list-subtitle">{{ estudiante.identificacion }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="detail-card">
              <div class="detail-header">
                <h3 class="detail-title">Materias</h3>
              </div>
              <div class="detail-content">
                <div v-if="!seccionSeleccionada?.materias || seccionSeleccionada?.materias.length === 0" class="detail-group">
                  No hay materias asignadas a esta sección.
                </div>
                <ul v-else class="detail-list">
                  <li v-for="materia in seccionSeleccionada?.materias" :key="materia.id" class="detail-list-item">
                    <div>
                      <div class="detail-list-title">{{ materia.nombre }}</div>
                      <div class="detail-list-subtitle">{{ materia.profesor?.nombre || 'Sin profesor asignado' }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="cerrarModalDetalles" class="btn btn-secondary">
              Cerrar
            </button>
            <button @click="seccionSeleccionada && editarSeccion(seccionSeleccionada)" class="btn btn-primary">
              Editar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal para confirmar eliminación -->
    <Teleport to="body">
      <div v-if="showConfirmModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              Confirmar Eliminación
            </h2>
            <button @click="cancelarEliminar" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="modal-content">
            <p>¿Está seguro que desea eliminar la sección <strong>{{ seccionSeleccionada?.nombre }}</strong>?</p>
            <p>Esta acción no se puede deshacer.</p>
            
            <div v-if="seccionSeleccionada && seccionSeleccionada.estudiantes.length > 0" class="form-error">
              <strong>Advertencia:</strong> Esta sección tiene {{ seccionSeleccionada.estudiantes.length }} estudiantes asignados. 
              Al eliminar la sección, los estudiantes perderán su asignación.
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="cancelarEliminar" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="eliminarSeccion" class="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlus, 
  faEye, 
  faEdit, 
  faTrash, 
  faXmark,
  faCheck,
  faSearch
} from '@fortawesome/free-solid-svg-icons'

// Registrar los iconos
library.add(
  faPlus, 
  faEye, 
  faEdit, 
  faTrash, 
  faXmark,
  faCheck,
  faSearch
)

// Interfaces
interface Profesor {
  id: number
  nombre: string
  especialidad: string
}

interface Estudiante {
  id: number
  nombre: string
  identificacion: string
  seccionId: number
}

interface Materia {
  id: number
  nombre: string
  profesor?: Profesor
}

interface Seccion {
  id: number
  nombre: string
  anioLectivoId: number
  profesorGuiaId?: number
  profesorGuia?: Profesor
  estudiantes: Estudiante[]
  materias?: Materia[]
}

interface AnioLectivo {
  id: number
  anio: number
  fechaInicio: string
  fechaFin: string
  activo: boolean
}

// Estado
const anioLectivoSeleccionado = ref<number | string>('')
const showFormModal = ref(false)
const showDetallesModal = ref(false)
const showConfirmModal = ref(false)
const modoEdicion = ref(false)
const seccionSeleccionada = ref<Seccion | null>(null)

// Formulario
const seccionForm = ref<{
  id?: number
  nombre: string
  anioLectivoId: number | null
  profesorGuiaId: number | string
}>({
  nombre: '',
  anioLectivoId: null,
  profesorGuiaId: ''
})

// Datos de ejemplo
const aniosLectivos = ref<AnioLectivo[]>([
  {
    id: 1,
    anio: 2023,
    fechaInicio: '2023-02-01',
    fechaFin: '2023-11-30',
    activo: false
  },
  {
    id: 2,
    anio: 2024,
    fechaInicio: '2024-02-05',
    fechaFin: '2024-12-05',
    activo: true
  },
  {
    id: 3,
    anio: 2025,
    fechaInicio: '2025-02-03',
    fechaFin: '2025-11-28',
    activo: false
  }
])

const profesores = ref<Profesor[]>([
  { id: 1, nombre: 'María Rodríguez', especialidad: 'Matemáticas' },
  { id: 2, nombre: 'Juan Pérez', especialidad: 'Español' },
  { id: 3, nombre: 'Ana Jiménez', especialidad: 'Ciencias' },
  { id: 4, nombre: 'Carlos Mora', especialidad: 'Estudios Sociales' },
  { id: 5, nombre: 'Laura Sánchez', especialidad: 'Inglés' }
])

const materias = ref<Materia[]>([
  { id: 1, nombre: 'Matemáticas', profesor: profesores.value[0] },
  { id: 2, nombre: 'Español', profesor: profesores.value[1] },
  { id: 3, nombre: 'Ciencias', profesor: profesores.value[2] },
  { id: 4, nombre: 'Estudios Sociales', profesor: profesores.value[3] },
  { id: 5, nombre: 'Inglés', profesor: profesores.value[4] },
  { id: 6, nombre: 'Educación Física' },
  { id: 7, nombre: 'Artes' }
])

const secciones = ref<Seccion[]>([
  {
    id: 1,
    nombre: '1A',
    anioLectivoId: 2,
    profesorGuiaId: 1,
    profesorGuia: profesores.value[0],
    estudiantes: [
      { id: 1, nombre: 'Ana García', identificacion: '1-2345-6789', seccionId: 1 },
      { id: 2, nombre: 'Carlos Pérez', identificacion: '2-3456-7890', seccionId: 1 },
      { id: 3, nombre: 'María López', identificacion: '3-4567-8901', seccionId: 1 }
    ],
    materias: [materias.value[0], materias.value[1], materias.value[2]]
  },
  {
    id: 2,
    nombre: '1B',
    anioLectivoId: 2,
    profesorGuiaId: 2,
    profesorGuia: profesores.value[1],
    estudiantes: [
      { id: 4, nombre: 'Pedro Sánchez', identificacion: '4-5678-9012', seccionId: 2 },
      { id: 5, nombre: 'Lucía González', identificacion: '5-6789-0123', seccionId: 2 }
    ],
    materias: [materias.value[0], materias.value[1], materias.value[3]]
  },
  {
    id: 3,
    nombre: '2A',
    anioLectivoId: 2,
    profesorGuiaId: 3,
    profesorGuia: profesores.value[2],
    estudiantes: [
      { id: 6, nombre: 'Daniel Torres', identificacion: '6-7890-1234', seccionId: 3 },
      { id: 7, nombre: 'Valentina Díaz', identificacion: '7-8901-2345', seccionId: 3 },
      { id: 8, nombre: 'Mateo Ruiz', identificacion: '8-9012-3456', seccionId: 3 }
    ],
    materias: [materias.value[0], materias.value[1], materias.value[4]]
  },
  {
    id: 4,
    nombre: '1A',
    anioLectivoId: 1,
    profesorGuiaId: 4,
    profesorGuia: profesores.value[3],
    estudiantes: [
      { id: 9, nombre: 'Isabella Morales', identificacion: '9-0123-4567', seccionId: 4 },
      { id: 10, nombre: 'Santiago Jiménez', identificacion: '1-1234-5678', seccionId: 4 }
    ],
    materias: [materias.value[0], materias.value[2], materias.value[5]]
  }
])

// Secciones filtradas según el año lectivo seleccionado
const seccionesFiltradas = computed(() => {
  if (!anioLectivoSeleccionado.value) {
    return secciones.value
  }
  
  return secciones.value.filter(seccion => 
    seccion.anioLectivoId === anioLectivoSeleccionado.value
  )
})

// Métodos
const filtrarSecciones = () => {
  // La lógica de filtrado se maneja en el computed seccionesFiltradas
  // Esta función se mantiene por si se necesita lógica adicional en el futuro
}

const abrirModalCrear = () => {
  modoEdicion.value = false
  seccionForm.value = {
    nombre: '',
    anioLectivoId: anioLectivoSeleccionado.value ? Number(anioLectivoSeleccionado.value) : null,
    profesorGuiaId: ''
  }
  showFormModal.value = true
}

const editarSeccion = (seccion: Seccion) => {
  modoEdicion.value = true
  seccionSeleccionada.value = seccion
  
  seccionForm.value = {
    id: seccion.id,
    nombre: seccion.nombre,
    anioLectivoId: seccion.anioLectivoId,
    profesorGuiaId: seccion.profesorGuiaId || ''
  }
  
  showFormModal.value = true
  showDetallesModal.value = false
}

const cerrarModal = () => {
  showFormModal.value = false
}

const guardarSeccion = () => {
  if (!seccionForm.value.nombre || !seccionForm.value.anioLectivoId) {
    alert('Por favor complete los campos requeridos')
    return
  }
  
  if (modoEdicion.value && seccionSeleccionada.value) {
    // Actualizar sección existente
    const index = secciones.value.findIndex(s => s.id === seccionSeleccionada.value?.id)
    
    if (index !== -1) {
      // Encontrar el profesor guía seleccionado
      const profesorGuia = seccionForm.value.profesorGuiaId ? 
        profesores.value.find(p => p.id === Number(seccionForm.value.profesorGuiaId)) : 
        undefined
      
      // Actualizar la sección
      secciones.value[index] = {
        ...secciones.value[index],
        nombre: seccionForm.value.nombre,
        anioLectivoId: Number(seccionForm.value.anioLectivoId),
        profesorGuiaId: seccionForm.value.profesorGuiaId ? Number(seccionForm.value.profesorGuiaId) : undefined,
        profesorGuia: profesorGuia
      }
      
      alert('Sección actualizada correctamente')
    }
  } else {
    // Crear nueva sección
    const nuevoId = Math.max(...secciones.value.map(s => s.id)) + 1
    
    // Encontrar el profesor guía seleccionado
    const profesorGuia = seccionForm.value.profesorGuiaId ? 
      profesores.value.find(p => p.id === Number(seccionForm.value.profesorGuiaId)) : 
      undefined
    
    // Crear la nueva sección
    const nuevaSeccion: Seccion = {
      id: nuevoId,
      nombre: seccionForm.value.nombre,
      anioLectivoId: Number(seccionForm.value.anioLectivoId),
      profesorGuiaId: seccionForm.value.profesorGuiaId ? Number(seccionForm.value.profesorGuiaId) : undefined,
      profesorGuia: profesorGuia,
      estudiantes: [],
      materias: materias.value // Todas las secciones llevan las mismas materias
    }
    
    secciones.value.push(nuevaSeccion)
    alert('Sección creada correctamente')
  }
  
  cerrarModal()
}

const verDetalles = (seccion: Seccion) => {
  seccionSeleccionada.value = seccion
  showDetallesModal.value = true
}

const cerrarModalDetalles = () => {
  showDetallesModal.value = false
  seccionSeleccionada.value = null
}

const confirmarEliminar = (seccion: Seccion) => {
  seccionSeleccionada.value = seccion
  showConfirmModal.value = true
}

const cancelarEliminar = () => {
  showConfirmModal.value = false
  seccionSeleccionada.value = null
}

const eliminarSeccion = () => {
  if (seccionSeleccionada.value) {
    const index = secciones.value.findIndex(s => s.id === seccionSeleccionada.value?.id)
    
    if (index !== -1) {
      secciones.value.splice(index, 1)
      alert('Sección eliminada correctamente')
    }
  }
  
  showConfirmModal.value = false
  seccionSeleccionada.value = null
}

const obtenerNombreAnioLectivo = (anioId?: number) => {
  if (!anioId) return 'No asignado'
  
  const anio = aniosLectivos.value.find(a => a.id === anioId)
  return anio ? `${anio.anio}${anio.activo ? ' (Activo)' : ''}` : 'No asignado'
}
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/secciones.css';
</style>
