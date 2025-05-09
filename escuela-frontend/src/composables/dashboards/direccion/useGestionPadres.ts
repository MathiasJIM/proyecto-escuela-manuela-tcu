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
  faUser,
  faEnvelope, 
  faUsers,
  faUserTie
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
  faUser,
  faEnvelope, 
  faUsers,
  faUserTie
)

// Definición de interfaces
interface Padre {
  id: number
  nombreCompleto: string
  email: string | null
}

export default function useGestionPadres() {
  // Datos de ejemplo
  const padres = ref<Padre[]>([
    {
      id: 1,
      nombreCompleto: 'Juan Pérez Rodríguez',
      email: 'juan.perez@example.com'
    },
    {
      id: 2,
      nombreCompleto: 'María González López',
      email: 'maria.gonzalez@example.com'
    },
    {
      id: 3,
      nombreCompleto: 'Carlos Sánchez Mora',
      email: null
    },
    {
      id: 4,
      nombreCompleto: 'Ana Jiménez Castro',
      email: 'ana.jimenez@example.com'
    },
    {
      id: 5,
      nombreCompleto: 'Roberto Fernández Vargas',
      email: null
    }
  ])

  // Formulario para crear/editar padre
  const formData = reactive({
    id: null as number | null,
    nombreCompleto: '',
    email: ''
  })

  // Estado para los modales
  const showModal = ref(false)
  const isEditing = ref(false)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const padreAEliminar = ref<Padre | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Padres filtrados por término de búsqueda
  const filteredPadres = computed(() => {
    if (!searchTerm.value) return padres.value

    const termLower = searchTerm.value.toLowerCase()
    return padres.value.filter(padre => 
      padre.nombreCompleto.toLowerCase().includes(termLower) || 
      (padre.email && padre.email.toLowerCase().includes(termLower))
    )
  })

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    alert(`${tipo.toUpperCase()}: ${mensaje}`)
  }

  // Abrir modal para crear/editar
  const openModal = (padre: Padre | null) => {
    if (padre) {
      // Editar padre existente
      formData.id = padre.id
      formData.nombreCompleto = padre.nombreCompleto
      formData.email = padre.email || ''
      isEditing.value = true
    } else {
      // Crear nuevo padre
      formData.id = null
      formData.nombreCompleto = ''
      formData.email = ''
      isEditing.value = false
    }
    showModal.value = true
  }

  // Cerrar modal
  const closeModal = () => {
    showModal.value = false
  }

  // Guardar padre (crear o actualizar)
  const guardarPadre = () => {
    // Validación básica
    if (!formData.nombreCompleto.trim()) {
      mostrarNotificacion('El nombre completo es obligatorio', 'error')
      return
    }

    if (formData.email && !validarEmail(formData.email)) {
      mostrarNotificacion('El formato del correo electrónico no es válido', 'error')
      return
    }

    if (isEditing.value && formData.id !== null) {
      // Actualizar padre existente
      const index = padres.value.findIndex(p => p.id === formData.id)
      if (index !== -1) {
        padres.value[index] = {
          id: formData.id,
          nombreCompleto: formData.nombreCompleto.trim(),
          email: formData.email.trim() || null
        }
        mostrarNotificacion('Padre actualizado correctamente', 'success')
      }
    } else {
      // Crear nuevo padre
      const newId = Math.max(0, ...padres.value.map(p => p.id)) + 1
      padres.value.push({
        id: newId,
        nombreCompleto: formData.nombreCompleto.trim(),
        email: formData.email.trim() || null
      })
      mostrarNotificacion('Padre agregado correctamente', 'success')
    }

    // Cerrar modal
    closeModal()
  }

  // Validar formato de email
  const validarEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Confirmar eliminación
  const confirmarEliminar = (padre: Padre) => {
    padreAEliminar.value = padre
    showConfirmDialog.value = true
  }

  // Eliminar padre
  const eliminarPadre = () => {
    if (padreAEliminar.value) {
      const index = padres.value.findIndex(p => p.id === padreAEliminar.value?.id)
      if (index !== -1) {
        padres.value.splice(index, 1)
        mostrarNotificacion('Padre eliminado correctamente', 'success')
      }
      showConfirmDialog.value = false
      padreAEliminar.value = null
    }
  }

  return {
    // Estado
    padres,
    formData,
    showModal,
    isEditing,
    showConfirmDialog,
    padreAEliminar,
    searchTerm,
    filteredPadres,
    
    // Métodos
    mostrarNotificacion,
    openModal,
    closeModal,
    guardarPadre,
    confirmarEliminar,
    eliminarPadre
  }
}
