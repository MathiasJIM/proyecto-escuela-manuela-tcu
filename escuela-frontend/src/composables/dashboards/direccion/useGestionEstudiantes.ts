import { ref, computed, onMounted } from 'vue'
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
  faUpload,
  faGraduationCap,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons'
import EstudiantesService from '@/services/estudiantes.service'
import type {
  Estudiante as EstudianteAPI,
  EstudianteCreate,
  EstudianteWithCredentials,
} from '@/services/estudiantes.service'
import SeccionesService from '@/services/secciones.service'
import type { Seccion } from '@/services/secciones.service'
import AniosLectivosService from '@/services/anios-lectivos.service'
import type { AnioLectivo } from '@/services/anios-lectivos.service'

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
  faUpload,
  faGraduationCap,
  faCalendarAlt,
)

// Re-exportar interfaces del servicio
export type { Estudiante, EstudianteCreate, EstudianteUpdate, EstudianteWithCredentials } from '@/services/estudiantes.service'

// Interfaz para el formulario
export interface FormData {
  id_estudiante: string
  cedula: string
  nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_seccion: string | null
}

export default function useGestionEstudiantes() {
  // Estado
  const estudiantes = ref<EstudianteAPI[]>([])
  const formData = ref<FormData>({
    id_estudiante: '',
    cedula: '',
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    id_seccion: null
  })
  const showModal = ref(false)
  const isEditing = ref(false)
  const showConfirmDialog = ref(false)
  const estudianteAEliminar = ref<EstudianteAPI | null>(null)
  const showDetailsModal = ref(false)
  const selectedEstudiante = ref<EstudianteAPI | null>(null)
  const searchTerm = ref('')
  const showImportModal = ref(false)
  const cargando = ref(false)
  const error = ref('')
  const showCredencialesModal = ref(false)
  const credencialesPadre = ref<{ correo: string; contrasena: string } | null>(null)
  const secciones = ref<Seccion[]>([])
  const anioActivo = ref<AnioLectivo | null>(null)
  const cargandoSecciones = ref(false)

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Crear un elemento de notificación
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="close-button" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
    
    // Estilos para la notificación
    notification.style.position = 'fixed'
    notification.style.top = '20px'
    notification.style.right = '20px'
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336'
    notification.style.color = 'white'
    notification.style.padding = '15px'
    notification.style.borderRadius = '4px'
    notification.style.zIndex = '9999'
    notification.style.minWidth = '300px'
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'
    
    // Agregar la notificación al DOM
    document.body.appendChild(notification)
    
    // Agregar evento para cerrar la notificación
    const closeButton = notification.querySelector('.notification-close')
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(notification)
      })
    }
    
    // Remover la notificación después de 5 segundos
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 5000)
  }

  // Estudiantes filtrados por término de búsqueda
  const filteredEstudiantes = computed(() => {
    if (!searchTerm.value) return estudiantes.value

    const term = searchTerm.value.toLowerCase()
    return estudiantes.value.filter((estudiante: EstudianteAPI) => {
      const nombreCompleto = `${estudiante.nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`.toLowerCase()
      return nombreCompleto.includes(term) || estudiante.cedula.toLowerCase().includes(term)
    })
  })

  // Cargar estudiantes desde el backend
  const cargarEstudiantes = async () => {
    cargando.value = true
    error.value = ''

    try {
      const data = await EstudiantesService.obtenerEstudiantes()
      estudiantes.value = data
    } catch (err: any) {
      console.error('Error al cargar estudiantes:', err)
      error.value = 'No se pudieron cargar los estudiantes. Intente nuevamente.'
      showNotification('No se pudieron cargar los estudiantes. Intente nuevamente.', 'error')
    } finally {
      cargando.value = false
    }
  }

  // Cargar secciones disponibles
  const cargarSecciones = async () => {
    cargandoSecciones.value = true
    try {
      secciones.value = await SeccionesService.obtenerSecciones()
      console.log('Secciones cargadas:', secciones.value)
    } catch (err: any) {
      console.error('Error al cargar secciones:', err)
      if (err.response && (err.response.status === 401 || err.response.status >= 500)) {
        showNotification(
          'No se pudieron cargar las secciones. Verifique su conexión e intente nuevamente.',
          'error',
        )
      } else if (!err.response) {
        showNotification('No se pudo conectar con el servidor. Verifique su conexión.', 'error')
      }
    } finally {
      cargandoSecciones.value = false
    }
  }

  // Cargar año lectivo activo
  const cargarAnioActivo = async () => {
    try {
      anioActivo.value = await AniosLectivosService.obtenerAnioLectivoActivo()
      console.log('Año lectivo activo cargado:', anioActivo.value)
    } catch (err: any) {
      console.error('Error al cargar año lectivo activo:', err)
      // Solo registrar el error, no mostrar notificación para no saturar al usuario
    }
  }

  // Abrir el modal para crear o editar un estudiante
  const openModal = (estudiante: EstudianteAPI | null) => {
    if (estudiante) {
      // Modo edición
      formData.value = {
        id_estudiante: estudiante.id_estudiante,
        cedula: estudiante.cedula,
        nombre: estudiante.nombre,
        primer_apellido: estudiante.primer_apellido,
        segundo_apellido: estudiante.segundo_apellido,
        id_seccion: estudiante.id_seccion
      }
      isEditing.value = true
    } else {
      // Modo creación
      formData.value = {
        id_estudiante: '',
        cedula: '',
        nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        id_seccion: null
      }
      isEditing.value = false
    }
    showModal.value = true
  }

  // Cerrar el modal
  const closeModal = () => {
    showModal.value = false
    formData.value = {
      id_estudiante: '',
      cedula: '',
      nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      id_seccion: null
    }
  }

  // Guardar un estudiante (crear o actualizar)
  const guardarEstudiante = async () => {
    if (!formData.value.cedula || !formData.value.nombre || !formData.value.primer_apellido || !formData.value.segundo_apellido) {
      showNotification('Por favor complete todos los campos requeridos', 'error')
      return
    }

    try {
      if (isEditing.value) {
        // Modo edición
        const estudianteActualizado = await EstudiantesService.actualizarEstudiante(formData.value.id_estudiante, {
          cedula: formData.value.cedula,
          nombre: formData.value.nombre,
          primer_apellido: formData.value.primer_apellido,
          segundo_apellido: formData.value.segundo_apellido,
          id_seccion: formData.value.id_seccion || undefined
        })
        
        // Actualizar el estudiante en la lista
        const index = estudiantes.value.findIndex(
          (e) => e.id_estudiante === formData.value.id_estudiante
        )
        if (index !== -1) {
          estudiantes.value[index] = {
            ...estudianteActualizado,
            id_seccion: estudianteActualizado.id_seccion || null
          }
        }
        
        showNotification('Estudiante actualizado exitosamente')
      } else {
        // Modo creación
        const nuevoEstudiante = await EstudiantesService.crearEstudiante({
          cedula: formData.value.cedula,
          nombre: formData.value.nombre,
          primer_apellido: formData.value.primer_apellido,
          segundo_apellido: formData.value.segundo_apellido,
          id_seccion: formData.value.id_seccion
        } as EstudianteCreate)
        
        // Agregar el nuevo estudiante a la lista
        estudiantes.value.push({
          ...nuevoEstudiante,
          id_seccion: nuevoEstudiante.id_seccion || null
        })
        showNotification('Estudiante creado exitosamente')
        
        // Mostrar las credenciales
        showCredencialesModal.value = true
        credencialesPadre.value = nuevoEstudiante.correo_padre && nuevoEstudiante.contrasena_padre ? {
          correo: nuevoEstudiante.correo_padre,
          contrasena: nuevoEstudiante.contrasena_padre
        } : null
      }
      
      // Cerrar el modal
      closeModal()
    } catch (err: any) {
      console.error('Error al guardar estudiante:', err)
      showNotification(
        err.response?.data?.message ||
          'No se pudo guardar el estudiante. Intente nuevamente.',
        'error'
      )
    }
  }

  // Ver detalles de un estudiante
  const verEstudiante = (estudiante: EstudianteAPI) => {
    selectedEstudiante.value = estudiante
    showDetailsModal.value = true
  }

  // Cerrar modal de detalles
  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedEstudiante.value = null
  }

  // Editar un estudiante
  const editarEstudiante = (estudiante: EstudianteAPI) => {
    if (estudiante) {
      openModal(estudiante)
    }
  }

  // Confirmar eliminación de estudiante
  const confirmarEliminarEstudiante = (estudiante: EstudianteAPI) => {
    estudianteAEliminar.value = estudiante
    showConfirmDialog.value = true
  }

  // Eliminar estudiante
  const eliminarEstudiante = async () => {
    if (!estudianteAEliminar.value) return

    cargando.value = true
    error.value = ''

    try {
      await EstudiantesService.eliminarEstudiante(estudianteAEliminar.value.id_estudiante)
      
      // Remover el estudiante de la lista
      estudiantes.value = estudiantes.value.filter(
        (e) => e.id_estudiante !== estudianteAEliminar.value?.id_estudiante
      )
      
      showNotification('Estudiante eliminado exitosamente')
    } catch (err: any) {
      console.error('Error al eliminar estudiante:', err)
      error.value = 'No se pudo eliminar el estudiante'
      showNotification('No se pudo eliminar el estudiante. Intente nuevamente.', 'error')
    } finally {
      cargando.value = false
      showConfirmDialog.value = false
      estudianteAEliminar.value = null
    }
  }

  // Abrir modal de importación
  const openImportModal = () => {
    showImportModal.value = true
  }

  // Cerrar modal de importación
  const closeImportModal = () => {
    showImportModal.value = false
  }

  // Procesar archivo de importación
  const procesarArchivo = async (file: File) => {
    showNotification('Funcionalidad de importación en desarrollo', 'error')
  }

  // Cargar datos iniciales
  onMounted(() => {
    cargarEstudiantes()
    cargarSecciones()
    cargarAnioActivo()
  })

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
    filteredEstudiantes,
    showImportModal,
    cargando,
    error,
    showCredencialesModal,
    credencialesPadre,
    secciones,
    anioActivo,
    cargandoSecciones,

    // Métodos
    cargarEstudiantes,
    openModal,
    closeModal,
    guardarEstudiante,
    verEstudiante,
    closeDetailsModal,
    editarEstudiante,
    confirmarEliminarEstudiante,
    eliminarEstudiante,
    openImportModal,
    closeImportModal,
    procesarArchivo
  }
}
