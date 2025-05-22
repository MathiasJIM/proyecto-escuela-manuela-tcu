import { ref, computed, onMounted } from 'vue'
import MateriasService from '@/services/materias.service'
import type { Materia as MateriaAPI, Profesor } from '@/services/materias.service'

// Interfaces
interface MateriaForm {
  id_materia?: string
  nombre: string
}

interface Notification {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  icon: string
  timeout?: number
}

export function useMaterias() {
  const materias = ref<MateriaAPI[]>([])
  const cargando = ref<boolean>(false)
  const error = ref<string>('')
  const busqueda = ref('')
  const showModal = ref(false)
  const showConfirmModal = ref(false)
  const showProfesoresModal = ref(false)
  const modoEdicion = ref(false)
  const materiaForm = ref<MateriaForm>({ nombre: '' })
  const materiaAEliminar = ref<MateriaAPI | null>(null)
  const materiaSeleccionada = ref<MateriaAPI | null>(null)
  const profesoresMateria = ref<Profesor[]>([])
  const notification = ref<Notification>({
    show: false,
    message: '',
    type: 'info',
    icon: 'fa-info-circle',
    timeout: 3000
  })

  const materiasFiltradas = computed(() => {
    if (!busqueda.value) return materias.value

    const termino = busqueda.value.toLowerCase()
    return materias.value.filter(materia => 
      materia.nombre.toLowerCase().includes(termino)
    )
  })

  const cargarMaterias = async () => {
    cargando.value = true
    error.value = ''

    try {
      materias.value = await MateriasService.obtenerMaterias()
    } catch (err) {
      console.error('Error al cargar materias:', err)
      error.value = 'No se pudieron cargar las materias. Intente nuevamente.'
    } finally {
      cargando.value = false
    }
  }

  const abrirModalCrear = () => {
    modoEdicion.value = false
    materiaForm.value = { nombre: '' }
    showModal.value = true
  }

  const editarMateria = (materia: MateriaAPI) => {
    modoEdicion.value = true
    materiaForm.value = {
      id_materia: materia.id_materia,
      nombre: materia.nombre
    }
    showModal.value = true
  }

  const cerrarModal = () => {
    showModal.value = false
  }

  const guardarMateria = async () => {
    if (!materiaForm.value.nombre) return

    cargando.value = true
    error.value = ''

    try {
      if (modoEdicion.value && materiaForm.value.id_materia) {
        const materiaActualizada = await MateriasService.actualizarMateria(
          materiaForm.value.id_materia,
          { nombre: materiaForm.value.nombre }
        )

        const index = materias.value.findIndex(m => m.id_materia === materiaForm.value.id_materia)
        if (index !== -1) {
          materias.value[index] = materiaActualizada
        }

        showNotification('Materia actualizada correctamente', 'success')
      } else {
        const nuevaMateria = await MateriasService.crearMateria({
          nombre: materiaForm.value.nombre
        })

        materias.value.push(nuevaMateria)

        showNotification('Materia creada correctamente', 'success')
      }

      cerrarModal()
    } catch (err: any) {
      console.error('Error al guardar materia:', err)
      let mensajeError = 'No se pudo guardar la materia. Intente nuevamente.'

      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail
      }

      showNotification(mensajeError, 'error')
    } finally {
      cargando.value = false
    }
  }

  const confirmarEliminar = (materia: MateriaAPI) => {
    materiaAEliminar.value = materia
    showConfirmModal.value = true
  }

  const cancelarEliminar = () => {
    materiaAEliminar.value = null
    showConfirmModal.value = false
  }

  const eliminarMateria = async () => {
    if (!materiaAEliminar.value) return

    cargando.value = true
    error.value = ''

    try {
      await MateriasService.eliminarMateria(materiaAEliminar.value.id_materia)

      const index = materias.value.findIndex(m => m.id_materia === materiaAEliminar.value?.id_materia)
      if (index !== -1) {
        materias.value.splice(index, 1)
      }

      showNotification('Materia eliminada correctamente', 'success')
      cancelarEliminar()
    } catch (err: any) {
      console.error('Error al eliminar materia:', err)
      let mensajeError = 'No se pudo eliminar la materia. Intente nuevamente.'

      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail
      }

      showNotification(mensajeError, 'error')
    } finally {
      cargando.value = false
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const iconMap = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    }

    notification.value = {
      show: true,
      message,
      type,
      icon: iconMap[type],
      timeout: 3000
    }

    setTimeout(() => {
      closeNotification()
    }, notification.value.timeout)
  }

  const closeNotification = () => {
    notification.value.show = false
  }

  const verDetalleProfesores = async (materia: MateriaAPI) => {
    materiaSeleccionada.value = materia
    cargando.value = true
    error.value = ''

    try {
      profesoresMateria.value = await MateriasService.obtenerProfesoresMateria(materia.id_materia)
      showProfesoresModal.value = true
    } catch (err: any) {
      console.error('Error al cargar profesores de la materia:', err)
      let mensajeError = 'No se pudieron cargar los profesores. Intente nuevamente.'

      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail
      }

      showNotification(mensajeError, 'error')
    } finally {
      cargando.value = false
    }
  }

  const cerrarDetalleProfesores = () => {
    showProfesoresModal.value = false
    materiaSeleccionada.value = null
    profesoresMateria.value = []
  }

  onMounted(() => {
    cargarMaterias()
  })

  return {
    // Estado
    materias,
    cargando,
    error,
    busqueda,
    showModal,
    showConfirmModal,
    showProfesoresModal,
    modoEdicion,
    materiaForm,
    materiaAEliminar,
    materiaSeleccionada,
    profesoresMateria,
    notification,
    materiasFiltradas,

    // Métodos
    cargarMaterias,
    abrirModalCrear,
    editarMateria,
    cerrarModal,
    guardarMateria,
    confirmarEliminar,
    cancelarEliminar,
    eliminarMateria,
    verDetalleProfesores,
    cerrarDetalleProfesores,
    showNotification,
    closeNotification
  }
}
