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
  faCalendarAlt,
  faCalendarCheck,
  faCalendarDay,
  faCheckCircle
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
  faCalendarAlt,
  faCalendarCheck,
  faCalendarDay,
  faCheckCircle
)

// Definición de interfaces
interface AnioLectivo {
  id: number
  anio: number
  fechaInicio: string
  fechaFin: string
  activo: boolean
}

export default function useGestionAnios() {
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

  // Formulario para editar año
  const formData = reactive({
    id: null as number | null,
    anio: 0,
    fechaInicio: '',
    fechaFin: '',
    activo: false
  })

  // Estado para los modales
  const showModal = ref(false)
  const isEditing = ref(false)
  const showDetailsModal = ref(false)
  const selectedAnio = ref<AnioLectivo | null>(null)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const anioAEliminar = ref<AnioLectivo | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Años filtrados por término de búsqueda
  const filteredAnios = computed(() => {
    if (!searchTerm.value) return aniosLectivos.value

    const termLower = searchTerm.value.toLowerCase()
    return aniosLectivos.value.filter(anio => 
      anio.anio.toString().includes(termLower) || 
      anio.fechaInicio.includes(termLower) ||
      anio.fechaFin.includes(termLower)
    )
  })

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    alert(`${tipo.toUpperCase()}: ${mensaje}`)
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr: string): string => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Ver detalles del año
  const verAnio = (anio: AnioLectivo) => {
    selectedAnio.value = anio
    showDetailsModal.value = true
  }

  // Cerrar modal de detalles
  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedAnio.value = null
  }

  // Abrir modal para editar
  const openModal = (anio: AnioLectivo | null) => {
    if (anio) {
      // Editar año existente
      formData.id = anio.id
      formData.anio = anio.anio
      formData.fechaInicio = anio.fechaInicio
      formData.fechaFin = anio.fechaFin
      formData.activo = anio.activo
      isEditing.value = true
    } else {
      // Crear nuevo año
      formData.id = null
      formData.anio = new Date().getFullYear() + 1
      formData.fechaInicio = ''
      formData.fechaFin = ''
      formData.activo = false
      isEditing.value = false
    }
    showModal.value = true
  }

  // Editar desde la vista de detalles
  const editarDesdeDetalles = () => {
    if (selectedAnio.value) {
      openModal(selectedAnio.value)
      closeDetailsModal()
    }
  }

  // Cerrar modal
  const closeModal = () => {
    showModal.value = false
  }

  // Guardar año (actualizar)
  const guardarAnio = () => {
    // Validación básica
    if (formData.anio <= 0) {
      mostrarNotificacion('El año debe ser un número válido', 'error')
      return
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      mostrarNotificacion('Las fechas de inicio y fin son obligatorias', 'error')
      return
    }

    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      mostrarNotificacion('La fecha de inicio debe ser anterior a la fecha de fin', 'error')
      return
    }

    if (isEditing.value && formData.id !== null) {
      // Actualizar año existente
      const index = aniosLectivos.value.findIndex(a => a.id === formData.id)
      if (index !== -1) {
        // Si estamos activando este año, desactivamos los demás
        if (formData.activo && !aniosLectivos.value[index].activo) {
          aniosLectivos.value.forEach(anio => {
            if (anio.id !== formData.id) {
              anio.activo = false
            }
          })
        }

        aniosLectivos.value[index] = {
          id: formData.id,
          anio: formData.anio,
          fechaInicio: formData.fechaInicio,
          fechaFin: formData.fechaFin,
          activo: formData.activo
        }
        mostrarNotificacion('Año lectivo actualizado correctamente', 'success')
      }
    } else {
      // Crear nuevo año
      const newId = Math.max(0, ...aniosLectivos.value.map(a => a.id)) + 1
      
      // Si el nuevo año será activo, desactivamos los demás
      if (formData.activo) {
        aniosLectivos.value.forEach(anio => {
          anio.activo = false
        })
      }

      aniosLectivos.value.push({
        id: newId,
        anio: formData.anio,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        activo: formData.activo
      })
      mostrarNotificacion('Año lectivo agregado correctamente', 'success')
    }

    // Cerrar modal
    closeModal()
  }

  // Confirmar eliminación
  const confirmarEliminar = (anio: AnioLectivo) => {
    anioAEliminar.value = anio
    showConfirmDialog.value = true
  }

  // Eliminar año
  const eliminarAnio = () => {
    if (anioAEliminar.value) {
      // No permitir eliminar el año activo
      if (anioAEliminar.value.activo) {
        mostrarNotificacion('No se puede eliminar el año lectivo activo', 'error')
        showConfirmDialog.value = false
        anioAEliminar.value = null
        return
      }

      const index = aniosLectivos.value.findIndex(a => a.id === anioAEliminar.value?.id)
      if (index !== -1) {
        aniosLectivos.value.splice(index, 1)
        mostrarNotificacion('Año lectivo eliminado correctamente', 'success')
      }
      showConfirmDialog.value = false
      anioAEliminar.value = null
    }
  }

  // Marcar año como activo
  const marcarComoActivo = (anio: AnioLectivo) => {
    // Desactivar todos los años
    aniosLectivos.value.forEach(a => {
      a.activo = false
    })

    // Activar el año seleccionado
    const index = aniosLectivos.value.findIndex(a => a.id === anio.id)
    if (index !== -1) {
      aniosLectivos.value[index].activo = true
      mostrarNotificacion(`El año ${anio.anio} ha sido marcado como activo`, 'success')
    }
  }

  return {
    // Estado
    aniosLectivos,
    formData,
    showModal,
    isEditing,
    showConfirmDialog,
    anioAEliminar,
    showDetailsModal,
    selectedAnio,
    searchTerm,
    filteredAnios,
    
    // Métodos
    mostrarNotificacion,
    formatearFecha,
    verAnio,
    closeDetailsModal,
    openModal,
    editarDesdeDetalles,
    closeModal,
    guardarAnio,
    confirmarEliminar,
    eliminarAnio,
    marcarComoActivo
  }
}
