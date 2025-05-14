<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Gestión de Horarios</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Crear Horario
      </button>
    </div>

    <div class="filters-container">
      <div class="filter-group">
        <label for="seccionFilter" class="filter-label">Sección:</label>
        <select 
          id="seccionFilter" 
          v-model="seccionSeleccionada" 
          class="filter-select"
          @change="cargarHorario"
        >
          <option value="">Seleccione una sección</option>
          <option 
            v-for="seccion in secciones" 
            :key="seccion.id" 
            :value="seccion.id"
          >
            {{ seccion.nombre }} ({{ obtenerNombreAnioLectivo(seccion.anioLectivoId) }})
          </option>
        </select>
      </div>
    </div>

    <div v-if="!seccionSeleccionada" class="empty-state">
      <p>Seleccione una sección para ver o crear su horario</p>
    </div>

    <div v-else class="schedule-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th></th>
            <th class="day-header">Lunes</th>
            <th class="day-header">Martes</th>
            <th class="day-header">Miércoles</th>
            <th class="day-header">Jueves</th>
            <th class="day-header">Viernes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hora, index) in horas" :key="index">
            <td class="time-cell">{{ hora }}</td>
            <td 
              v-for="dia in dias" 
              :key="dia.id" 
              @click="abrirModalAsignar(dia.id, index)"
            >
              <div 
                v-if="obtenerClase(dia.id, index)" 
                :class="['schedule-slot', obtenerClaseEstilo(obtenerClase(dia.id, index)?.materiaId)]"
              >
                <div class="schedule-slot-subject">
                  {{ obtenerNombreMateria(obtenerClase(dia.id, index)?.materiaId) }}
                </div>
                <div class="schedule-slot-teacher">
                  {{ obtenerNombreProfesor(obtenerClase(dia.id, index)?.profesorId) }}
                </div>
              </div>
              <div v-else class="empty-slot">
                <span>Haga clic para asignar</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para asignar clase -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ modoEdicion ? 'Editar' : 'Asignar' }} Clase
            </h2>
            <button @click="cerrarModal" class="modal-close-btn">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          
          <div class="modal-content">
            <form @submit.prevent="guardarClase">
              <div class="form-group">
                <label for="dia" class="form-label">Día</label>
                <input 
                  type="text" 
                  id="dia" 
                  :value="obtenerNombreDia(claseForm.diaId)" 
                  class="form-control"
                  disabled
                />
              </div>
              
              <div class="form-group">
                <label for="hora" class="form-label">Hora</label>
                <input 
                  type="text" 
                  id="hora" 
                  :value="horas[claseForm.horaIndex]" 
                  class="form-control"
                  disabled
                />
              </div>
              
              <div class="form-group">
                <label for="materia" class="form-label">Materia</label>
                <select 
                  id="materia" 
                  v-model="claseForm.materiaId" 
                  class="form-select"
                  required
                >
                  <option value="" disabled>Seleccione una materia</option>
                  <option 
                    v-for="materia in materias" 
                    :key="materia.id" 
                    :value="materia.id"
                  >
                    {{ materia.nombre }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="profesor" class="form-label">Profesor</label>
                <select 
                  id="profesor" 
                  v-model="claseForm.profesorId" 
                  class="form-select"
                  required
                >
                  <option value="" disabled>Seleccione un profesor</option>
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
            <button 
              v-if="modoEdicion" 
              @click="eliminarClase" 
              class="btn btn-secondary"
              type="button"
            >
              Eliminar
            </button>
            <button 
              @click="cerrarModal" 
              class="btn btn-secondary"
              type="button"
            >
              Cancelar
            </button>
            <button 
              @click="guardarClase" 
              class="btn btn-primary"
              type="button"
            >
              {{ modoEdicion ? 'Actualizar' : 'Asignar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlus, 
  faXmark,
  faClock,
  faCalendarDay,
  faChalkboardTeacher,
  faBook
} from '@fortawesome/free-solid-svg-icons'

// Registrar los iconos
library.add(
  faPlus, 
  faXmark,
  faClock,
  faCalendarDay,
  faChalkboardTeacher,
  faBook
)

// Interfaces
interface Profesor {
  id: number
  nombre: string
  especialidad: string
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
  estudiantes: { id: number; nombre: string; identificacion: string }[]
  materias?: Materia[]
}

interface AnioLectivo {
  id: number
  anio: number
  fechaInicio: string
  fechaFin: string
  activo: boolean
}

interface Dia {
  id: number
  nombre: string
}

interface Clase {
  id: number
  seccionId: number
  diaId: number
  horaIndex: number
  materiaId: number
  profesorId: number
}

// Estado
const seccionSeleccionada = ref<number | string>('')
const showModal = ref(false)
const modoEdicion = ref(false)
const claseSeleccionada = ref<Clase | null>(null)

// Formulario
const claseForm = ref<{
  id?: number
  seccionId: number | string
  diaId: number
  horaIndex: number
  materiaId: number | string
  profesorId: number | string
}>({
  seccionId: '',
  diaId: 0,
  horaIndex: 0,
  materiaId: '',
  profesorId: ''
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
    estudiantes: [],
    materias: [materias.value[0], materias.value[1], materias.value[2]]
  },
  {
    id: 2,
    nombre: '1B',
    anioLectivoId: 2,
    profesorGuiaId: 2,
    profesorGuia: profesores.value[1],
    estudiantes: [],
    materias: [materias.value[0], materias.value[1], materias.value[3]]
  },
  {
    id: 3,
    nombre: '2A',
    anioLectivoId: 2,
    profesorGuiaId: 3,
    profesorGuia: profesores.value[2],
    estudiantes: [],
    materias: [materias.value[0], materias.value[1], materias.value[4]]
  }
])

const dias = ref<Dia[]>([
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' }
])

const horas = ref([
  '7:00 - 7:40',
  '7:40 - 8:20',
  '8:20 - 9:00',
  '9:00 - 9:20', // Recreo
  '9:20 - 10:00',
  '10:00 - 10:40',
  '10:40 - 11:20',
  '11:20 - 12:00'
])

const clases = ref<Clase[]>([
  {
    id: 1,
    seccionId: 1,
    diaId: 1,
    horaIndex: 0,
    materiaId: 1,
    profesorId: 1
  },
  {
    id: 2,
    seccionId: 1,
    diaId: 1,
    horaIndex: 1,
    materiaId: 1,
    profesorId: 1
  },
  {
    id: 3,
    seccionId: 1,
    diaId: 2,
    horaIndex: 0,
    materiaId: 2,
    profesorId: 2
  },
  {
    id: 4,
    seccionId: 1,
    diaId: 3,
    horaIndex: 4,
    materiaId: 3,
    profesorId: 3
  }
])

// Métodos
const cargarHorario = () => {
  // En una implementación real, aquí se cargarían los datos del horario desde el servidor
  console.log(`Cargando horario para la sección ${seccionSeleccionada.value}`)
}

const abrirModalCrear = () => {
  if (!seccionSeleccionada.value) {
    alert('Por favor, seleccione una sección primero')
    return
  }
  
  // Aquí se podría implementar la lógica para crear un horario completo
  alert('Esta función permitirá crear un horario completo en una implementación futura')
}

const abrirModalAsignar = (diaId: number, horaIndex: number) => {
  if (!seccionSeleccionada.value) {
    alert('Por favor, seleccione una sección primero')
    return
  }
  
  const clase = obtenerClase(diaId, horaIndex)
  
  if (clase) {
    // Editar clase existente
    modoEdicion.value = true
    claseSeleccionada.value = clase
    
    claseForm.value = {
      id: clase.id,
      seccionId: clase.seccionId,
      diaId: clase.diaId,
      horaIndex: clase.horaIndex,
      materiaId: clase.materiaId,
      profesorId: clase.profesorId
    }
  } else {
    // Crear nueva clase
    modoEdicion.value = false
    claseSeleccionada.value = null
    
    claseForm.value = {
      seccionId: seccionSeleccionada.value,
      diaId: diaId,
      horaIndex: horaIndex,
      materiaId: '',
      profesorId: ''
    }
  }
  
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
  claseSeleccionada.value = null
}

const guardarClase = () => {
  if (!claseForm.value.materiaId || !claseForm.value.profesorId) {
    alert('Por favor complete todos los campos')
    return
  }
  
  if (modoEdicion.value && claseSeleccionada.value) {
    // Actualizar clase existente
    const index = clases.value.findIndex(c => c.id === claseSeleccionada.value?.id)
    
    if (index !== -1) {
      clases.value[index] = {
        ...clases.value[index],
        materiaId: Number(claseForm.value.materiaId),
        profesorId: Number(claseForm.value.profesorId)
      }
      
      alert('Clase actualizada correctamente')
    }
  } else {
    // Crear nueva clase
    const nuevoId = Math.max(...clases.value.map(c => c.id), 0) + 1
    
    const nuevaClase: Clase = {
      id: nuevoId,
      seccionId: Number(claseForm.value.seccionId),
      diaId: claseForm.value.diaId,
      horaIndex: claseForm.value.horaIndex,
      materiaId: Number(claseForm.value.materiaId),
      profesorId: Number(claseForm.value.profesorId)
    }
    
    clases.value.push(nuevaClase)
    alert('Clase asignada correctamente')
  }
  
  cerrarModal()
}

const eliminarClase = () => {
  if (claseSeleccionada.value) {
    const index = clases.value.findIndex(c => c.id === claseSeleccionada.value?.id)
    
    if (index !== -1) {
      clases.value.splice(index, 1)
      alert('Clase eliminada correctamente')
    }
  }
  
  cerrarModal()
}

const obtenerClase = (diaId: number, horaIndex: number) => {
  return clases.value.find(c => 
    c.seccionId === Number(seccionSeleccionada.value) && 
    c.diaId === diaId && 
    c.horaIndex === horaIndex
  ) || null
}

const obtenerNombreMateria = (materiaId?: number | string) => {
  if (!materiaId) return 'No asignada'
  
  const materia = materias.value.find(m => m.id === Number(materiaId))
  return materia ? materia.nombre : 'No asignada'
}

const obtenerNombreProfesor = (profesorId?: number | string) => {
  if (!profesorId) return 'No asignado'
  
  const profesor = profesores.value.find(p => p.id === Number(profesorId))
  return profesor ? profesor.nombre : 'No asignado'
}

const obtenerNombreDia = (diaId: number) => {
  const dia = dias.value.find(d => d.id === diaId)
  return dia ? dia.nombre : ''
}

const obtenerNombreAnioLectivo = (anioId: number) => {
  const anio = aniosLectivos.value.find(a => a.id === anioId)
  return anio ? `${anio.anio}${anio.activo ? ' (Activo)' : ''}` : 'No asignado'
}

const obtenerClaseEstilo = (materiaId?: number) => {
  if (!materiaId) return ''
  
  const estilos = {
    1: 'math',
    2: 'spanish',
    3: 'science',
    4: 'social',
    5: 'english',
    6: 'pe',
    7: 'arts'
  }
  
  return estilos[materiaId as keyof typeof estilos] || ''
}
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/horarios.css';

.empty-state {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 48px;
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 32px;
}
</style>
