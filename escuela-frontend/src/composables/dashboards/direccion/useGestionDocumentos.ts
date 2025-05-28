import { ref, computed, onMounted } from 'vue'
import { documentosService } from '@/services/documentos.service'
import type { Documento, DocumentoCreate, DocumentoUpdate } from '@/services/documentos.service'

// Interfaces para el formulario y notificaciones
interface DocumentoForm {
  titulo: string
  descripcion: string
  tipo: 'planeamiento' | 'circular' | 'material' | 'informe' | 'otro'
  archivo: string
  destinatario: 'direccion' | 'profesores' | 'padres' | 'todos'
}

interface Notification {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
}


export default function useGestionDocumentos() {
  // Estado
  const documentos = ref<Documento[]>([])
  const documentoSeleccionado = ref<Documento | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const showModal = ref(false)
  const showConfirmDialog = ref(false)
  const modoEdicion = ref(false)


  
  // Estado
  const tiposDocumento = ref([
    { id: 'planeamiento', nombre: 'Planeamiento' },
    { id: 'circular', nombre: 'Circular' },
    { id: 'material', nombre: 'Material' },
    { id: 'informe', nombre: 'Informe' },
    { id: 'otro', nombre: 'Otro' },
  ])

  // Estado para el formulario
  const formData = ref<DocumentoForm>({
    titulo: '',
    descripcion: '',
    tipo: 'otro',
    archivo: '',
    destinatario: 'todos',
  })

  // Estado para la búsqueda y filtros
  const busqueda = ref('')
  const filtroDestinatario = ref<string>('')
  const filtroTipo = ref<string>('')

  // Estado para notificaciones
  const notification = ref<Notification>({
    show: false,
    message: '',
    type: 'info',
  })

  // Documentos filtrados
  const documentosFiltrados = computed(() => {
    let resultado = documentos.value

    // Filtro por búsqueda
    if (busqueda.value) {
      const termino = busqueda.value.toLowerCase()
      resultado = resultado.filter(
        (doc) =>
          doc.titulo.toLowerCase().includes(termino) ||
          (doc.descripcion && doc.descripcion.toLowerCase().includes(termino)),
      )
    }

    // Filtro por tipo
    if (filtroTipo.value) {
      resultado = resultado.filter((doc) => doc.tipo === filtroTipo.value)
    }

    // Filtro por destinatario
    if (filtroDestinatario.value) {
      resultado = resultado.filter(
        (doc) => doc.destinatario === filtroDestinatario.value || doc.destinatario === 'todos',
      )
    }

    return resultado
  })

  // Obtener el nombre del destinatario
  const getDestinatarioNombre = (destinatario: string) => {
    const destinatarios: Record<string, string> = {
      todos: 'Todos',
      direccion: 'Solo Dirección',
      profesores: 'Solo Profesores',
      padres: 'Solo Padres',
    }
    return destinatarios[destinatario] || destinatario
  }

  // Obtener el nombre del tipo de documento
  const obtenerNombreTipoDocumento = (tipo: string) => {
    const tipos: Record<string, string> = {
      planeamiento: 'Planeamiento',
      circular: 'Circular',
      material: 'Material',
      informe: 'Informe',
      otro: 'Otro',
    }
    return tipos[tipo] || tipo
  }

  // Función para manejar el guardado de documentos
  const handleGuardarDocumento = () => {
    guardarDocumento()
  }

  // Cargar documentos
  const cargarDocumentos = async () => {
    isLoading.value = true
    error.value = null

    try {
      documentos.value = await documentosService.obtenerDocumentos()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al cargar los documentos'
      mostrarNotificacion(error.value || 'Error al cargar los documentos', 'error')
    } finally {
      isLoading.value = false
    }
  }

  // Abrir modal para crear documento
  const abrirModalCrear = () => {
    modoEdicion.value = false
    formData.value = {
      titulo: '',
      descripcion: '',
      tipo: 'otro',
      archivo: '',
      destinatario: 'todos',
    }
    showModal.value = true
  }

  // Abrir modal para editar documento
  const abrirModalEditar = (documento: Documento) => {
    modoEdicion.value = true
    formData.value = {
      titulo: documento.titulo,
      descripcion: documento.descripcion || '',
      tipo: documento.tipo,
      archivo: documento.archivo,
      destinatario: documento.destinatario,
    }
    documentoSeleccionado.value = documento
    showModal.value = true
  }

  // Cerrar modal
  const cerrarModal = () => {
    showModal.value = false
    documentoSeleccionado.value = null
  }

  // Guardar documento (crear o actualizar)
  const guardarDocumento = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Validar URL
      if (!formData.value.archivo) {
        throw new Error('Debe proporcionar un enlace válido')
      }

      if (modoEdicion.value && documentoSeleccionado.value) {
        // Actualizar documento existente
        const documentoUpdate: DocumentoUpdate = {
          titulo: formData.value.titulo,
          descripcion: formData.value.descripcion,
          tipo: formData.value.tipo,
          archivo: formData.value.archivo,
          destinatario: formData.value.destinatario,
        }

        await documentosService.actualizarDocumento(
          documentoSeleccionado.value.id_documento,
          documentoUpdate,
        )
        mostrarNotificacion('Documento actualizado correctamente', 'success')
      } else {
        // Crear nuevo documento
        const nuevoDocumento: DocumentoCreate = {
          titulo: formData.value.titulo,
          descripcion: formData.value.descripcion,
          tipo: formData.value.tipo,
          archivo: formData.value.archivo,
          destinatario: formData.value.destinatario,
        }

        await documentosService.crearDocumento(nuevoDocumento)
        mostrarNotificacion('Documento creado correctamente', 'success')
      }

      // Recargar documentos y cerrar modal
      await cargarDocumentos()
      cerrarModal()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al guardar el documento'
      mostrarNotificacion(error.value || 'Error al guardar el documento', 'error')
    } finally {
      isLoading.value = false
    }
  }

  // Confirmar eliminación
  const confirmarEliminar = (documento: Documento) => {
    documentoSeleccionado.value = documento
    showConfirmDialog.value = true
  }

  // Cancelar eliminación
  const cancelarEliminar = () => {
    showConfirmDialog.value = false
    documentoSeleccionado.value = null
  }

  // Eliminar documento
  const eliminarDocumento = async () => {
    if (!documentoSeleccionado.value) return

    isLoading.value = true
    error.value = null

    try {
      await documentosService.eliminarDocumento(documentoSeleccionado.value.id_documento)
      mostrarNotificacion('Documento eliminado correctamente', 'success')
      await cargarDocumentos()
      showConfirmDialog.value = false
      documentoSeleccionado.value = null
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Error al eliminar el documento'
      mostrarNotificacion(error.value || 'Error al eliminar el documento', 'error')
    } finally {
      isLoading.value = false
    }
  }

  // Mostrar notificación
  const mostrarNotificacion = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
  ) => {
    notification.value = {
      show: true,
      message,
      type,
      timeout: 5000,
    }

    // Auto-cerrar notificación después de timeout
    setTimeout(() => {
      cerrarNotificacion()
    }, notification.value.timeout)
  }

  // Cerrar notificación
  const cerrarNotificacion = () => {
    notification.value.show = false
  }

  // Formatear fecha
  const formatearFecha = (fechaStr: string): string => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDocumentos()
  })

  return {
    // Estado
    documentos,
    documentosFiltrados,
    documentoSeleccionado,
    isLoading,
    error,
    showModal,
    showConfirmDialog,
    modoEdicion,
    formData,
    busqueda,
    filtroDestinatario,
    filtroTipo,
    notification,
    tiposDocumento,


    // Métodos
    cargarDocumentos,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    guardarDocumento,
    confirmarEliminar,
    cancelarEliminar,
    eliminarDocumento,
    mostrarNotificacion,
    cerrarNotificacion,
    formatearFecha,
    getDestinatarioNombre,
    obtenerNombreTipoDocumento,
    handleGuardarDocumento,

  }
}
