import { ref, computed, onMounted } from 'vue'
import { useAvisosStore } from '@/stores/avisos.store'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date'
import type { Aviso, AvisoCreate, TipoDestinatario } from '@/services/avisos.service'

export default function useAvisos() {
  // Store
  const avisosStore = useAvisosStore()

  // Estado
  const busqueda = ref('')
  const showModal = ref(false)
  const showVerModal = ref(false)
  const avisoSeleccionado = ref<Aviso | null>(null)
  const modoEdicion = ref(false)
  const avisoForm = ref<AvisoCreate>({
    titulo: '',
    contenido: '',
    fecha_envio: '',
    destinatario: 'todos'
  })
  const notification = ref({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  })

  // Computed
  const avisosFiltrados = computed(() => {
    return avisosStore.avisos.filter((aviso: Aviso) => {
      const coincideTitulo = aviso.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
      return coincideTitulo
    })
  })

  const esFormularioValido = computed(() => {
    const form = avisoForm.value
    return (
      form.titulo.trim() !== '' &&
      form.contenido.trim() !== ''
      // Ya no validamos fecha_envio porque se establece automáticamente al guardar
    )
  })

  // Métodos
  function abrirModalCrear() {
    modoEdicion.value = false
    
    avisoForm.value = {
      titulo: '',
      contenido: '',
      fecha_envio: '', // La fecha se establecerá al guardar
      destinatario: 'todos'
    }
    showModal.value = true
  }

  function editarAviso(aviso: Aviso) {
    modoEdicion.value = true
    avisoForm.value = {
      titulo: aviso.titulo,
      contenido: aviso.contenido,
      fecha_envio: '', // La fecha se actualizará al guardar
      destinatario: aviso.destinatario
    }
    showModal.value = true
  }

  function verAviso(aviso: Aviso) {
    avisoSeleccionado.value = aviso
    showVerModal.value = true
  }

  function cerrarModal() {
    showModal.value = false
    avisoForm.value = {
      titulo: '',
      contenido: '',
      fecha_envio: '',
      destinatario: 'todos'
    }
    modoEdicion.value = false
    avisoSeleccionado.value = null
  }

  function cerrarModalVer() {
    showVerModal.value = false
    avisoSeleccionado.value = null
  }

  async function guardarAviso() {
    try {
      // Obtener la fecha y hora actual formateada
      const fechaActual = new Date()
      const fechaFormateada = fechaActual.toISOString().split('.')[0] // Formato ISO sin milisegundos
      
      if (modoEdicion.value && avisoSeleccionado.value) {
        await avisosStore.actualizarAviso({
          ...avisoForm.value,
          fecha_envio: fechaFormateada,
          id_aviso: avisoSeleccionado.value.id_aviso
        })
        showNotification('Aviso actualizado correctamente', 'success')
      } else {
        await avisosStore.crearAviso({
          ...avisoForm.value,
          fecha_envio: fechaFormateada
        })
        showNotification('Aviso creado correctamente', 'success')
      }
      cerrarModal()
    } catch (error) {
      showNotification('Error al guardar el aviso: ' + (error as Error).message, 'error')
    }
  }

  async function eliminarAviso(aviso: Aviso) {
    try {
      await avisosStore.eliminarAviso(aviso.id_aviso)
      showNotification('Aviso eliminado correctamente', 'success')
    } catch (error) {
      showNotification('Error al eliminar el aviso: ' + (error as Error).message, 'error')
    }
  }

  function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    notification.value = {
      show: true,
      message,
      type
    }
    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }

  // Cargar datos iniciales
  onMounted(async () => {
    try {
      await avisosStore.cargarAvisos()
    } catch (e) {
      showNotification('Error al cargar los avisos', 'error')
      console.error(e)
    }
  })

  return {
    // Estado
    busqueda,
    showModal,
    showVerModal,
    avisoSeleccionado,
    modoEdicion,
    avisoForm,
    notification,
    avisos: avisosStore.avisos,
    avisosStore,
    formatDate,

    // Computed
    avisosFiltrados,
    esFormularioValido,

    // Métodos
    abrirModalCrear,
    editarAviso,
    verAviso,
    cerrarModal,
    cerrarModalVer,
    guardarAviso,
    eliminarAviso,
    showNotification,
  }
}
