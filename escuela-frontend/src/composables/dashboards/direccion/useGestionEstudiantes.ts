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
  faUserGraduate,
  faEnvelope, 
  faUsers,
  faUserShield,
  faFileExcel,
  faFileImport,
  faUpload
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
  faUserGraduate,
  faEnvelope, 
  faUsers,
  faUserShield,
  faFileExcel,
  faFileImport,
  faUpload
)

// Definición de interfaces
export interface Seccion {
  id: number
  nombre: string
}

export interface Responsable {
  id: number
  nombreCompleto: string
  email: string
  telefono: string
}

export interface Estudiante {
  id: number
  nombreCompleto: string
  seccion: Seccion
  responsable: Responsable | null
}

// Interfaz para el formulario
export interface FormData {
  id: number
  nombreCompleto: string
  seccion: Seccion | null
  responsable: Responsable | null
}

export default function useGestionEstudiantes() {
  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    alert(`${tipo.toUpperCase()}: ${mensaje}`)
    // En un entorno real, aquí se usaría un sistema de notificaciones más sofisticado
  }

  // Estado para la lista de estudiantes
  const estudiantes = ref<Estudiante[]>([
    {
      id: 1,
      nombreCompleto: 'Ana María Hernández Solís',
      seccion: { id: 1, nombre: '7-A' },
      responsable: {
        id: 1,
        nombreCompleto: 'Carlos Hernández Mora',
        email: 'carlos.hernandez@mail.com',
        telefono: '8888-1234'
      }
    },
    {
      id: 2,
      nombreCompleto: 'José Pablo Ramírez Vargas',
      seccion: { id: 2, nombre: '8-B' },
      responsable: null
    },
    {
      id: 3,
      nombreCompleto: 'Laura Sofía Méndez Castro',
      seccion: { id: 3, nombre: '9-A' },
      responsable: {
        id: 2,
        nombreCompleto: 'María Castro Jiménez',
        email: 'maria.castro@mail.com',
        telefono: '8888-5678'
      }
    }
  ])

  // Datos para el formulario
  const formData = reactive<FormData>({
    id: 0,
    nombreCompleto: '',
    seccion: null,
    responsable: null
  })

  // Estado para los modales
  const showModal = ref(false)
  const isEditing = ref(false)
  const showImportModal = ref(false)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const estudianteAEliminar = ref<Estudiante | null>(null)

  // Estado para el modal de detalles
  const showDetailsModal = ref(false)
  const selectedEstudiante = ref<Estudiante | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Datos para los selects
  const seccionesDisponibles = ref<Seccion[]>([
    { id: 1, nombre: '7-A' },
    { id: 2, nombre: '8-B' },
    { id: 3, nombre: '9-A' },
    { id: 4, nombre: '9-B' },
    { id: 5, nombre: '10-A' },
    { id: 6, nombre: '11-A' }
  ])

  // Filtrar estudiantes según el término de búsqueda
  const filteredEstudiantes = computed(() => {
    if (!searchTerm.value) return estudiantes.value
    
    const term = searchTerm.value.toLowerCase()
    return estudiantes.value.filter(estudiante => 
      estudiante.nombreCompleto.toLowerCase().includes(term) ||
      estudiante.seccion.nombre.toLowerCase().includes(term) ||
      (estudiante.responsable && estudiante.responsable.nombreCompleto.toLowerCase().includes(term))
    )
  })

  // Funciones para formatear datos en la tabla
  const formatResponsable = (responsable: Responsable | null) => {
    if (!responsable) return 'No registrado'
    return responsable.nombreCompleto
  }

  // Funciones para manejar el modal
  const openModal = (estudiante: Estudiante | null) => {
    if (estudiante) {
      // Modo edición
      isEditing.value = true
      formData.id = estudiante.id
      formData.nombreCompleto = estudiante.nombreCompleto
      formData.seccion = { ...estudiante.seccion }
      formData.responsable = estudiante.responsable ? { ...estudiante.responsable } : null
    } else {
      // Modo creación
      isEditing.value = false
      formData.id = 0
      formData.nombreCompleto = ''
      formData.seccion = null
      formData.responsable = null
    }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
  }

  // Funciones para guardar el estudiante
  const guardarEstudiante = () => {
    if (!formData.seccion) {
      mostrarNotificacion('Debe seleccionar una sección', 'error')
      return
    }

    // Aquí iría la lógica para guardar en la API
    if (isEditing.value) {
      // Actualizar estudiante existente
      const index = estudiantes.value.findIndex(e => e.id === formData.id)
      if (index !== -1) {
        estudiantes.value[index] = { 
          ...formData, 
          seccion: formData.seccion as Seccion 
        } as Estudiante
        mostrarNotificacion('Estudiante actualizado correctamente', 'success')
      }
    } else {
      // Crear nuevo estudiante
      const nuevoId = Math.max(0, ...estudiantes.value.map(e => e.id)) + 1
      estudiantes.value.push({
        id: nuevoId,
        nombreCompleto: formData.nombreCompleto,
        seccion: formData.seccion as Seccion,
        responsable: formData.responsable
      })
      mostrarNotificacion('Estudiante agregado correctamente', 'success')
    }
    closeModal()
  }

  // Funciones para ver y eliminar estudiante
  const verEstudiante = (estudiante: Estudiante) => {
    selectedEstudiante.value = estudiante
    showDetailsModal.value = true
  }

  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedEstudiante.value = null
  }

  const editarDesdeDetalles = () => {
    if (selectedEstudiante.value) {
      openModal(selectedEstudiante.value)
      closeDetailsModal()
    }
  }

  const confirmarEliminar = (estudiante: Estudiante) => {
    estudianteAEliminar.value = estudiante
    showConfirmDialog.value = true
  }

  const eliminarEstudiante = () => {
    if (estudianteAEliminar.value) {
      const nombreEstudiante = estudianteAEliminar.value.nombreCompleto
      estudiantes.value = estudiantes.value.filter(e => e.id !== estudianteAEliminar.value?.id)
      mostrarNotificacion(`Estudiante ${nombreEstudiante} eliminado correctamente`, 'success')
      showConfirmDialog.value = false
      estudianteAEliminar.value = null
    }
  }

    // Funciones para importar estudiantes desde Excel
  const openImportModal = () => {
    showImportModal.value = true
  }

  const closeImportModal = () => {
    showImportModal.value = false
  }

  const importarEstudiantes = (file: File) => {
    // Aquí iría la lógica para procesar el archivo Excel
    // Por ahora, solo mostraremos una notificación
    mostrarNotificacion(`Archivo ${file.name} recibido. Se procesará en el backend.`, 'info')
    closeImportModal()
  }

  return {
    // Estado
    estudiantes,
    formData,
    showModal,
    isEditing,
    showConfirmDialog,
    estudianteAEliminar,
    showDetailsModal,
    selectedEstudiante,
    searchTerm,
    seccionesDisponibles,
    filteredEstudiantes,
    showImportModal,
    
    // Métodos
    mostrarNotificacion,
    formatResponsable,
    openModal,
    closeModal,
    guardarEstudiante,
    verEstudiante,
    closeDetailsModal,
    editarDesdeDetalles,
    confirmarEliminar,
    eliminarEstudiante,
    openImportModal,
    closeImportModal,
    importarEstudiantes
  }
}
