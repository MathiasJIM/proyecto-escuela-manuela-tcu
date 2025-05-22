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

// Definición de interfaces
export interface Estudiante {
  id_estudiante: string
  nombre: string
  id_padre: string | null
  seccion?: {
    id_seccion: string
    nombre: string
    grado: string
  }
  credenciales?: {
    correo: string
    contrasena: string
  }
}

// Interfaz para el formulario
export interface FormData {
  id_estudiante: string
  nombre: string
  id_seccion?: string
  id_anio?: string
}

export default function useGestionEstudiantes() {
  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Crear un elemento de notificación
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
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
    notification.style.zIndex = '1000'
    notification.style.minWidth = '300px'
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
    
    // Agregar al DOM
    document.body.appendChild(notification)
    
    // Botón para cerrar
    const closeBtn = notification.querySelector('.notification-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(notification)
      })
    }
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 5000)
  }

  // Estado para la lista de estudiantes
  const estudiantes = ref<Estudiante[]>([])
  const cargando = ref(false)
  const error = ref('')

  // Estado para las secciones y años lectivos
  const secciones = ref<Seccion[]>([])
  const anioActivo = ref<AnioLectivo | null>(null)
  const cargandoSecciones = ref(false)

  // Datos para el formulario
  const formData = ref<FormData>({
    id_estudiante: '',
    nombre: '',
    id_seccion: undefined,
    id_anio: undefined,
  })

  // Estado para los modales
  const showModal = ref(false)
  const isEditing = ref(false)
  const showImportModal = ref(false)
  const showCredencialesModal = ref(false)
  const credencialesPadre = ref<{ correo: string; contrasena: string } | null>(null)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const estudianteAEliminar = ref<Estudiante | null>(null)

  // Estado para el modal de detalles
  const showDetailsModal = ref(false)
  const selectedEstudiante = ref<Estudiante | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Estudiantes filtrados según el término de búsqueda
  const filteredEstudiantes = computed(() => {
    if (!searchTerm.value) return estudiantes.value

    const term = searchTerm.value.toLowerCase()
    return estudiantes.value.filter((estudiante) => {
      return estudiante.nombre.toLowerCase().includes(term)
    })
  })

  // Cargar estudiantes desde el backend
  const cargarEstudiantes = async () => {
    cargando.value = true
    error.value = ''

    try {
      const data = await EstudiantesService.obtenerEstudiantes()
      estudiantes.value = data.map((est) => ({
        id_estudiante: est.id_estudiante,
        nombre: est.nombre,
        id_padre: est.id_padre,
        seccion: est.seccion,
      }))
    } catch (err: any) {
      console.error('Error al cargar estudiantes:', err)
      error.value = 'No se pudieron cargar los estudiantes. Intente nuevamente.'
      showNotification('No se pudieron cargar los estudiantes. Intente nuevamente.', 'error')
    } finally {
      cargando.value = false
    }
  }

  // Cargar datos iniciales
  onMounted(() => {
    cargarEstudiantes()
    cargarSecciones()
    cargarAnioActivo()
  })

  // Cargar secciones disponibles
  const cargarSecciones = async () => {
    cargandoSecciones.value = true
    try {
      secciones.value = await SeccionesService.obtenerSecciones()
      console.log('Secciones cargadas:', secciones.value)
    } catch (err: any) {
      console.error('Error al cargar secciones:', err)
      // Solo mostrar notificación si es un error de autorización o de servidor
      if (err.response && (err.response.status === 401 || err.response.status >= 500)) {
        showNotification(
          'No se pudieron cargar las secciones. Verifique su conexión e intente nuevamente.',
          'error',
        )
      } else if (!err.response) {
        // Error de red o servidor no disponible
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
      // Si no hay año lectivo activo, simplemente no se preseleccionará ninguno
    }
  }

  // Abrir el modal para crear o editar un estudiante
  const openModal = (estudiante: Estudiante | null) => {
    if (estudiante) {
      // Modo edición
      formData.value = {
        id_estudiante: estudiante.id_estudiante,
        nombre: estudiante.nombre,
        id_seccion: estudiante.seccion?.id_seccion,
        id_anio: anioActivo.value?.id_anio
      }
      isEditing.value = true
    } else {
      // Modo creación
      formData.value = {
        id_estudiante: '',
        nombre: '',
        id_seccion: undefined,
        id_anio: anioActivo.value?.id_anio
      }
      isEditing.value = false
    }
    showModal.value = true
  }

  // Cerrar el modal
  const closeModal = () => {
    showModal.value = false
  }

  // Guardar un estudiante (crear o actualizar)
  const guardarEstudiante = async () => {
    if (!formData.value.nombre) {
      showNotification('Por favor complete todos los campos requeridos', 'error')
      return
    }

    cargando.value = true
    error.value = ''

    try {
      if (isEditing.value) {
        // Actualizar estudiante existente
        await EstudiantesService.actualizarEstudiante(formData.value.id_estudiante, {
          nombre: formData.value.nombre,
          id_seccion: formData.value.id_seccion,
          id_anio: formData.value.id_anio || anioActivo.value?.id_anio,
        })
        
        // Actualizar directamente el estudiante en el array en memoria
        const index = estudiantes.value.findIndex(e => e.id_estudiante === formData.value.id_estudiante)
        if (index !== -1) {
          // Obtener la sección si existe
          const seccion = formData.value.id_seccion ? 
            secciones.value.find(s => s.id_seccion === formData.value.id_seccion) : undefined
          
          // Actualizar el estudiante en el array
          estudiantes.value[index] = {
            ...estudiantes.value[index],
            nombre: formData.value.nombre,
            seccion: seccion ? {
              id_seccion: seccion.id_seccion,
              nombre: seccion.nombre,
              grado: seccion.grado
            } : undefined
          }
          
          // Crear un nuevo array para forzar la reactividad
          estudiantes.value = [...estudiantes.value]
        }
        
        showNotification('Estudiante actualizado correctamente', 'success')
        closeModal()
      } else {
        // Crear nuevo estudiante
        const datosEstudiante = {
          nombre: formData.value.nombre,
          id_seccion: formData.value.id_seccion,
          id_anio: formData.value.id_anio,
        }

        const response = await EstudiantesService.crearEstudiante(datosEstudiante)

        // Mostrar credenciales del padre
        credencialesPadre.value = {
          correo: response.correo_padre,
          contrasena: response.contrasena_padre,
        }
        showCredencialesModal.value = true

        // Obtener la sección si existe
        const seccion = formData.value.id_seccion ? 
          secciones.value.find(s => s.id_seccion === formData.value.id_seccion) : undefined

        // Agregar el nuevo estudiante al array en memoria
        estudiantes.value.push({
          id_estudiante: response.id_estudiante,
          nombre: formData.value.nombre,
          id_padre: response.id_padre,
          seccion: seccion ? {
            id_seccion: seccion.id_seccion,
            nombre: seccion.nombre,
            grado: seccion.grado
          } : undefined
        })
        
        // Crear un nuevo array para forzar la reactividad
        estudiantes.value = [...estudiantes.value]

        // Mostrar mensaje de éxito con información adicional sobre la matrícula
        if (response.matriculado) {
          showNotification('Estudiante creado y matriculado correctamente', 'success')
        } else {
          showNotification('Estudiante creado correctamente', 'success')
        }
        
        closeModal()
      }
    } catch (err: any) {
      console.error('Error al guardar estudiante:', err)
      error.value = 'No se pudo guardar el estudiante. Intente nuevamente.'
      showNotification('No se pudo guardar el estudiante. Intente nuevamente.', 'error')
    } finally {
      cargando.value = false
    }
  }

  // Cerrar el modal de credenciales
  const closeCredencialesModal = () => {
    showCredencialesModal.value = false
    credencialesPadre.value = null
  }

  // Ver detalles de un estudiante
  const verEstudiante = (estudiante: Estudiante) => {
    selectedEstudiante.value = estudiante
    showDetailsModal.value = true
  }

  // Cerrar el modal de detalles
  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedEstudiante.value = null
  }

  // Editar desde el modal de detalles
  const editarDesdeDetalles = () => {
    if (selectedEstudiante.value) {
      openModal(selectedEstudiante.value)
      closeDetailsModal()
    }
  }

  // Confirmar eliminación de un estudiante
  const confirmarEliminar = (estudiante: Estudiante) => {
    estudianteAEliminar.value = estudiante
    showConfirmDialog.value = true
  }

  // Eliminar un estudiante
  const eliminarEstudiante = async () => {
    if (!estudianteAEliminar.value) return

    cargando.value = true
    error.value = ''

    try {
      await EstudiantesService.eliminarEstudiante(estudianteAEliminar.value.id_estudiante)
      
      // Actualizar directamente el array de estudiantes en memoria
      estudiantes.value = estudiantes.value.filter(e => e.id_estudiante !== estudianteAEliminar.value?.id_estudiante)
      
      showNotification('Estudiante eliminado correctamente', 'success')
    } catch (err: any) {
      console.error('Error al eliminar estudiante:', err)
      error.value = 'No se pudo eliminar el estudiante. Intente nuevamente.'
      showNotification('No se pudo eliminar el estudiante. Intente nuevamente.', 'error')
    } finally {
      cargando.value = false
      showConfirmDialog.value = false
      estudianteAEliminar.value = null
    }
  }

  // Abrir el modal de importación
  const openImportModal = () => {
    showImportModal.value = true
  }

  // Cerrar el modal de importación
  const closeImportModal = () => {
    showImportModal.value = false
  }

  // Importar estudiantes desde Excel (función de ejemplo)
  const importarEstudiantes = (file: File) => {
    console.log('Importando estudiantes desde:', file.name)
    showNotification(`Archivo ${file.name} importado correctamente`, 'success')
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
    editarDesdeDetalles,
    confirmarEliminar,
    eliminarEstudiante,
    openImportModal,
    closeImportModal,
    importarEstudiantes,
    closeCredencialesModal,
  }
}
