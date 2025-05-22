import { ref, computed, onMounted } from 'vue'
import SeccionesService from '@/services/secciones.service'
import ProfesoresService from '@/services/profesores.service'
import type { Seccion as SeccionAPI, Profesor, SeccionCreate, SeccionUpdate } from '@/services/secciones.service'

// Interfaces
interface SeccionForm {
  id_seccion?: string
  nombre: string
  grado: string
  id_profesor_guia: string | null
  id_anio: string
}

interface Notification {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  icon: string
  timeout?: number
}

export function useSecciones(idAnioDefault?: string) {
  // Estado
  const secciones = ref<SeccionAPI[]>([])
  const profesores = ref<Profesor[]>([])
  const cargando = ref<boolean>(false)
  const error = ref<string>('')
  const busqueda = ref('')
  const showModal = ref(false)
  const showConfirmModal = ref(false)
  const showProfesoresModal = ref(false)
  const modoEdicion = ref(false)
  const seccionForm = ref<SeccionForm>({ 
    nombre: '', 
    grado: '', 
    id_profesor_guia: null, 
    id_anio: idAnioDefault || '' 
  })
  const seccionAEliminar = ref<SeccionAPI | null>(null)
  const seccionSeleccionada = ref<SeccionAPI | null>(null)
  const profesoresSeccion = ref<Profesor[]>([])
  const notification = ref<Notification>({
    show: false,
    message: '',
    type: 'info',
    icon: 'fa-info-circle',
    timeout: 3000
  })

  // Computed
  const seccionesFiltradas = computed(() => {
    if (!busqueda.value) return secciones.value

    const termino = busqueda.value.toLowerCase()
    return secciones.value.filter(seccion => 
      seccion.nombre.toLowerCase().includes(termino) || 
      seccion.grado.toLowerCase().includes(termino)
    )
  })

  // Cargar secciones desde el backend
  const cargarSecciones = async (idAnio?: string) => {
    cargando.value = true
    error.value = ''

    try {
      if (idAnio) {
        secciones.value = await SeccionesService.obtenerSeccionesPorAnio(idAnio)
      } else {
        secciones.value = await SeccionesService.obtenerSecciones()
      }
    } catch (err: any) {
      console.error('Error al cargar secciones:', err)
      error.value = 'No se pudieron cargar las secciones. Intente nuevamente.'
      
      if (err.response && err.response.data && err.response.data.detail) {
        error.value = err.response.data.detail
      }
    } finally {
      cargando.value = false
    }
  }

  // Abrir modal para crear una nueva sección
  const abrirModalCrear = () => {
    modoEdicion.value = false
    seccionForm.value = { 
      nombre: '', 
      grado: '', 
      id_profesor_guia: null, 
      id_anio: idAnioDefault || '' 
    }
    showModal.value = true
  }

  // Abrir modal para editar una sección existente
  const editarSeccion = (seccion: SeccionAPI) => {
    modoEdicion.value = true
    seccionForm.value = { 
      id_seccion: seccion.id_seccion,
      nombre: seccion.nombre,
      grado: seccion.grado,
      id_profesor_guia: seccion.id_profesor_guia,
      id_anio: seccion.id_anio
    }
    showModal.value = true
  }

  // Cerrar modal
  const cerrarModal = () => {
    showModal.value = false
  }

  // Guardar sección (crear o actualizar)
  const guardarSeccion = async () => {
    cargando.value = true
    error.value = ''

    try {
      if (modoEdicion.value && seccionForm.value.id_seccion) {
        // Actualizar sección existente
        await SeccionesService.actualizarSeccion(
          seccionForm.value.id_seccion,
          {
            nombre: seccionForm.value.nombre,
            grado: seccionForm.value.grado,
            id_profesor_guia: seccionForm.value.id_profesor_guia,
            id_anio: seccionForm.value.id_anio
          }
        )

        showNotification('Sección actualizada correctamente', 'success')
      } else {
        // Crear nueva sección
        await SeccionesService.crearSeccion({
          nombre: seccionForm.value.nombre,
          grado: seccionForm.value.grado,
          id_profesor_guia: seccionForm.value.id_profesor_guia,
          id_anio: seccionForm.value.id_anio
        })

        showNotification('Sección creada correctamente', 'success')
      }

      // Recargar la lista de secciones para obtener los datos actualizados incluyendo el nombre del profesor guía
      await cargarSecciones()
      
      cerrarModal()
    } catch (err: any) {
      console.error('Error al guardar sección:', err)
      let mensajeError = 'No se pudo guardar la sección. Intente nuevamente.'

      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail
      }

      showNotification(mensajeError, 'error')
    } finally {
      cargando.value = false
    }
  }

  const confirmarEliminar = (seccion: SeccionAPI) => {
    seccionAEliminar.value = seccion
    showConfirmModal.value = true
  }

  const cancelarEliminar = () => {
    seccionAEliminar.value = null
    showConfirmModal.value = false
  }

  const eliminarSeccion = async () => {
    if (!seccionAEliminar.value) return

    cargando.value = true
    error.value = ''

    try {
      await SeccionesService.eliminarSeccion(seccionAEliminar.value.id_seccion)

      const index = secciones.value.findIndex(s => s.id_seccion === seccionAEliminar.value?.id_seccion)
      if (index !== -1) {
        secciones.value.splice(index, 1)
      }

      showNotification('Sección eliminada correctamente', 'success')
      cancelarEliminar()
    } catch (err: any) {
      console.error('Error al eliminar sección:', err)
      let mensajeError = 'No se pudo eliminar la sección. Intente nuevamente.'

      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail
      }

      showNotification(mensajeError, 'error')
    } finally {
      cargando.value = false
    }
  }

  // Métodos para ver profesores asignados a una sección
  const verDetalleProfesores = async (seccion: SeccionAPI) => {
    seccionSeleccionada.value = seccion
    cargando.value = true
    error.value = ''

    try {
      profesoresSeccion.value = await SeccionesService.obtenerProfesoresSeccion(seccion.id_seccion)
      showProfesoresModal.value = true
    } catch (err: any) {
      console.error('Error al cargar profesores de la sección:', err)
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
    seccionSeleccionada.value = null
    profesoresSeccion.value = []
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

  // Cargar profesores desde el backend
  const cargarProfesores = async () => {
    try {
      profesores.value = await ProfesoresService.obtenerProfesores()
    } catch (err: any) {
      console.error('Error al cargar profesores:', err)
      let mensajeError = 'No se pudieron cargar los profesores. Intente nuevamente.'

      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail
      }

      showNotification(mensajeError, 'error')
    }
  }

  onMounted(async () => {
    // Cargar secciones y profesores al montar el componente
    await Promise.all([
      idAnioDefault ? cargarSecciones(idAnioDefault) : cargarSecciones(),
      cargarProfesores()
    ])
  })

  return {
    // Estado
    secciones,
    profesores,
    cargando,
    error,
    busqueda,
    showModal,
    showConfirmModal,
    showProfesoresModal,
    modoEdicion,
    seccionForm,
    seccionAEliminar,
    seccionSeleccionada,
    profesoresSeccion,
    notification,
    seccionesFiltradas,

    // Métodos
    cargarSecciones,
    cargarProfesores,
    abrirModalCrear,
    editarSeccion,
    cerrarModal,
    guardarSeccion,
    confirmarEliminar,
    cancelarEliminar,
    eliminarSeccion,
    verDetalleProfesores,
    cerrarDetalleProfesores,
    showNotification,
    closeNotification
  }
}
