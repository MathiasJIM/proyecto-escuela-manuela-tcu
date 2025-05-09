import { ref, reactive, computed } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlus, 
  faEye, 
  faPen, 
  faTrashAlt, 
  faXmark, 
  faSearch, 
  faTimes, 
  faUserTie, 
  faEnvelope, 
  faBook, 
  faUsers 
} from '@fortawesome/free-solid-svg-icons'

// Registrar los iconos
library.add(
  faPlus, 
  faEye, 
  faPen, 
  faTrashAlt, 
  faXmark, 
  faSearch, 
  faTimes, 
  faUserTie, 
  faEnvelope, 
  faBook, 
  faUsers
)

// Definición de interfaces
export interface Materia {
  id: number
  nombre: string
}

export interface Seccion {
  id: number
  nombre: string
}

export interface Profesor {
  id: number
  nombreCompleto: string
  email: string
  materias: Materia[]
  secciones: Seccion[]
}

// Interfaz para el formulario
export interface FormData {
  id: number
  nombreCompleto: string
  email: string
  materias: Materia[]
  secciones: Seccion[]
}

export default function useGestionProfes() {
  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    alert(`${tipo.toUpperCase()}: ${mensaje}`)
    // En un entorno real, aquí se usaría un sistema de notificaciones más sofisticado
  }

  // Estado para la lista de profesores
  const profesores = ref<Profesor[]>([
    {
      id: 1,
      nombreCompleto: 'María Rodríguez Pérez',
      email: 'maria.rodriguez@escuela.edu',
      materias: [
        { id: 1, nombre: 'Matemáticas' },
        { id: 2, nombre: 'Física' }
      ],
      secciones: [
        { id: 1, nombre: '7-A' },
        { id: 2, nombre: '8-B' }
      ]
    },
    {
      id: 2,
      nombreCompleto: 'Carlos Jiménez Mora',
      email: 'carlos.jimenez@escuela.edu',
      materias: [
        { id: 3, nombre: 'Español' },
        { id: 4, nombre: 'Literatura' },
        { id: 5, nombre: 'Historia' }
      ],
      secciones: [
        { id: 3, nombre: '9-A' },
        { id: 4, nombre: '9-B' }
      ]
    }
  ])

  // Datos para el formulario
  const formData = reactive<FormData>({
    id: 0,
    nombreCompleto: '',
    email: '',
    materias: [],
    secciones: []
  })

  // Estado para el modal
  const showModal = ref(false)
  const isEditing = ref(false)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const profesorAEliminar = ref<Profesor | null>(null)

  // Estado para el modal de detalles
  const showDetailsModal = ref(false)
  const selectedProfesor = ref<Profesor | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Datos para los selects
  const materiasDisponibles = ref<Materia[]>([
    { id: 1, nombre: 'Matemáticas' },
    { id: 2, nombre: 'Física' },
    { id: 3, nombre: 'Español' },
    { id: 4, nombre: 'Literatura' },
    { id: 5, nombre: 'Historia' },
    { id: 6, nombre: 'Ciencias' },
    { id: 7, nombre: 'Educación Física' },
    { id: 8, nombre: 'Artes' },
    { id: 9, nombre: 'Inglés' }
  ])

  const seccionesDisponibles = ref<Seccion[]>([
    { id: 1, nombre: '7-A' },
    { id: 2, nombre: '8-B' },
    { id: 3, nombre: '9-A' },
    { id: 4, nombre: '9-B' },
    { id: 5, nombre: '10-A' },
    { id: 6, nombre: '11-A' }
  ])

  // Variables temporales para los selects múltiples
  const selectedMateria = ref<Materia | null>(null)
  const selectedSeccion = ref<Seccion | null>(null)

  // Filtrar profesores según el término de búsqueda
  const filteredProfesores = computed(() => {
    if (!searchTerm.value) return profesores.value
    
    const term = searchTerm.value.toLowerCase()
    return profesores.value.filter(profesor => 
      profesor.nombreCompleto.toLowerCase().includes(term) ||
      profesor.email.toLowerCase().includes(term)
    )
  })

  // Funciones para formatear datos en la tabla
  const formatMaterias = (materias: Materia[]) => {
    if (!materias || materias.length === 0) return 'Ninguna'
    if (materias.length <= 2) {
      return materias.map(m => m.nombre).join(', ')
    }
    return `${materias[0].nombre}, ${materias[1].nombre}...`
  }

  const formatSecciones = (secciones: Seccion[]) => {
    if (!secciones || secciones.length === 0) return 'Ninguna'
    return secciones.map(s => s.nombre).join(', ')
  }

  // Funciones para manejar el modal
  const openModal = (profesor: Profesor | null) => {
    if (profesor) {
      // Modo edición
      isEditing.value = true
      formData.id = profesor.id
      formData.nombreCompleto = profesor.nombreCompleto
      formData.email = profesor.email
      formData.materias = [...profesor.materias]
      formData.secciones = [...profesor.secciones]
    } else {
      // Modo creación
      isEditing.value = false
      formData.id = 0
      formData.nombreCompleto = ''
      formData.email = ''
      formData.materias = []
      formData.secciones = []
    }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedMateria.value = null
    selectedSeccion.value = null
  }

  // Funciones para manejar materias y secciones
  const agregarMateria = () => {
    if (selectedMateria.value) {
      const materia = selectedMateria.value // Crear una variable local para evitar el error de TypeScript
      // Verificar que no esté ya agregada
      if (!formData.materias.some(m => m.id === materia.id)) {
        formData.materias.push(materia)
      }
      selectedMateria.value = null
    }
  }

  const eliminarMateria = (index: number) => {
    formData.materias.splice(index, 1)
  }

  const agregarSeccion = () => {
    if (selectedSeccion.value) {
      const seccion = selectedSeccion.value // Crear variable local para evitar error de TypeScript
      // Verificar que no esté ya agregada
      if (!formData.secciones.some(s => s.id === seccion.id)) {
        formData.secciones.push(seccion)
      }
      selectedSeccion.value = null
    }
  }

  const eliminarSeccion = (index: number) => {
    formData.secciones.splice(index, 1)
  }

  // Funciones para guardar el profesor
  const guardarProfesor = () => {
    // Aquí iría la lógica para guardar en la API
    if (isEditing.value) {
      // Actualizar profesor existente
      const index = profesores.value.findIndex(p => p.id === formData.id)
      if (index !== -1) {
        profesores.value[index] = { ...formData } as Profesor
        mostrarNotificacion('Profesor actualizado correctamente', 'success')
      }
    } else {
      // Crear nuevo profesor
      const nuevoId = Math.max(0, ...profesores.value.map(p => p.id)) + 1
      profesores.value.push({
        ...formData,
        id: nuevoId
      } as Profesor)
      mostrarNotificacion('Profesor agregado correctamente', 'success')
    }
    closeModal()
  }

  // Funciones para ver y eliminar profesor
  const verProfesor = (profesor: Profesor) => {
    selectedProfesor.value = profesor
    showDetailsModal.value = true
  }

  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedProfesor.value = null
  }

  const editarDesdeDetalles = () => {
    if (selectedProfesor.value) {
      openModal(selectedProfesor.value)
      closeDetailsModal()
    }
  }

  const confirmarEliminar = (profesor: Profesor) => {
    profesorAEliminar.value = profesor
    showConfirmDialog.value = true
  }

  const eliminarProfesor = () => {
    if (profesorAEliminar.value) {
      const nombreProfesor = profesorAEliminar.value.nombreCompleto
      profesores.value = profesores.value.filter(p => p.id !== profesorAEliminar.value?.id)
      mostrarNotificacion(`Profesor ${nombreProfesor} eliminado correctamente`, 'success')
      showConfirmDialog.value = false
      profesorAEliminar.value = null
    }
  }

  return {
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
    mostrarNotificacion,
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
  }
}