import { ref, reactive, computed, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlus, 
  faEye, 
  faPen, 
  faTrashAlt, 
  faXmark, 
  faSearch, 
  faTimes, 
  faUser,
  faEnvelope, 
  faUsers,
  faUserTie,
  faSync
} from '@fortawesome/free-solid-svg-icons'
import PadresService, { type Padre, type PadreWithHijos, type PadreCreate, type PadreUpdate } from '@/services/padres.service'

// Registrar los iconos
library.add(
  faPlus, 
  faEye, 
  faPen, 
  faTrashAlt, 
  faXmark, 
  faSearch, 
  faTimes, 
  faUser,
  faEnvelope, 
  faUsers,
  faUserTie,
  faSync
)

export default function useGestionPadres() {
  // Estado para notificaciones
  const notification = reactive({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info' | 'warning',
    timeout: null as number | null
  })
  
  // Estado para la lista de padres
  const padres = ref<PadreWithHijos[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Formulario para crear/editar padre
  const formData = reactive({
    id_usuario: null as string | null,
    nombre: '',
    correo: '',
    activo: true,
    foto: null as string | null
  })

  // Estado para los modales
  const showModal = ref(false)
  const isEditing = ref(false)

  // Estado para el modal de detalles
  const showDetallesModal = ref(false)
  const padreSeleccionado = ref<PadreWithHijos | null>(null)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const padreAEliminar = ref<PadreWithHijos | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Padres filtrados por término de búsqueda
  const filteredPadres = computed(() => {
    if (!searchTerm.value) return padres.value

    const termLower = searchTerm.value.toLowerCase()
    return padres.value.filter(padre => 
      padre.nombre.toLowerCase().includes(termLower) || 
      (padre.correo && padre.correo.toLowerCase().includes(termLower))
    )
  })

  // Cargar padres al montar el componente
  onMounted(async () => {
    await cargarPadres()
  })

  // Función para cargar padres desde el backend
  const cargarPadres = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      padres.value = await PadresService.obtenerPadres()
    } catch (err) {
      console.error('Error al cargar padres:', err)
      error.value = 'Error al cargar la lista de padres. Por favor, intente de nuevo.'
      showNotification(error.value, 'error')
    } finally {
      isLoading.value = false
    }
  }

  // Abrir modal para crear/editar
  const openModal = (padre: Padre | null) => {
    if (padre) {
      // Editar padre existente
      formData.id_usuario = padre.id_usuario
      formData.nombre = padre.nombre
      formData.correo = padre.correo
      formData.activo = padre.activo
      formData.foto = padre.foto || null
      isEditing.value = true
    } else {
      // Crear nuevo padre
      formData.id_usuario = null
      formData.nombre = ''
      formData.correo = ''
      formData.activo = true
      formData.foto = null
      isEditing.value = false
    }
    showModal.value = true
  }

  // Cerrar modal
  const closeModal = () => {
    showModal.value = false
  }

  // Ver detalles del padre
  const verDetalles = (padre: PadreWithHijos) => {
    padreSeleccionado.value = padre
    showDetallesModal.value = true
  }

  // Cerrar modal de detalles
  const closeDetallesModal = () => {
    showDetallesModal.value = false
    padreSeleccionado.value = null
  }

  // Guardar padre (crear o actualizar)
  const guardarPadre = async () => {
    // Validación básica
    if (!formData.nombre.trim()) {
      showNotification('El nombre completo es obligatorio', 'error')
      return
    }

    if (formData.correo && !validarEmail(formData.correo)) {
      showNotification('El formato del correo electrónico no es válido', 'error')
      return
    }

    try {
      if (isEditing.value && formData.id_usuario) {
        // Actualizar padre existente
        const padreActualizado: PadreUpdate = {
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim() || undefined,
          activo: formData.activo,
        }
        
        await PadresService.actualizarPadre(formData.id_usuario, padreActualizado)
        showNotification('Padre actualizado correctamente', 'success')
      } else {
        // Crear nuevo padre
        const nuevoPadre: PadreCreate = {
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim() || '',
          activo: formData.activo,
          foto: formData.foto || undefined
        }
        
        await PadresService.crearPadre(nuevoPadre)
        showNotification('Padre agregado correctamente', 'success')
      }
      
      // Recargar la lista de padres
      await cargarPadres()
      
      // Cerrar modal
      closeModal()
    } catch (err: any) {
      console.error('Error al guardar padre:', err)
      const errorMsg = err.response?.data?.detail || 'Error al guardar. Por favor, intente de nuevo.'
      showNotification(errorMsg, 'error')
    }
  }

  // Validar formato de email
  const validarEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Confirmar eliminación
  const confirmarEliminar = (padre: PadreWithHijos) => {
    padreAEliminar.value = padre
    showConfirmDialog.value = true
  }

  // Eliminar padre
  const eliminarPadre = async () => {
    if (padreAEliminar.value) {
      try {
        await PadresService.eliminarPadre(padreAEliminar.value.id_usuario)
        showNotification('Padre eliminado correctamente', 'success')
        
        // Recargar la lista de padres
        await cargarPadres()
      } catch (err: any) {
        console.error('Error al eliminar padre:', err)
        const errorMsg = err.response?.data?.detail || 'Error al eliminar. Por favor, intente de nuevo.'
        showNotification(errorMsg, 'error')
      } finally {
        showConfirmDialog.value = false
        padreAEliminar.value = null
      }
    }
  }

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    notification.show = true
    notification.message = message
    notification.type = type
    
    // Limpiar cualquier timeout anterior
    if (notification.timeout) {
      clearTimeout(notification.timeout)
    }
    
    // Auto-ocultar después de 3 segundos
    notification.timeout = window.setTimeout(() => {
      notification.show = false
    }, 3000) as unknown as number
  }

  return {
    // Estado
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
    cargarPadres
  }
}