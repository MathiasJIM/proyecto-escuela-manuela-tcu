import { ref, onMounted, computed } from 'vue'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Definición de tipos
interface CitaPendiente {
  id: number
  estudiante: string
  padre: string
  fecha: Date
  hora: string
  motivo: string
}

interface CitaConfirmada extends CitaPendiente {
  enlaceVideo: string | null
}

interface CitaHistorial {
  id: number
  estudiante: string
  padre: string
  fecha: Date
  estado: string
}

export function useCitas() {
  // Estado para controlar las secciones plegables
  const showPendientesSection = ref(true)
  const showConfirmadasSection = ref(true)
  const showHistorialSection = ref(true)

  // Fecha actual formateada
  const formattedCurrentDate = computed(() => {
    return format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })
  })

  // Funciones para alternar la visibilidad de las secciones
  const togglePendientesSection = () => {
    showPendientesSection.value = !showPendientesSection.value
  }

  const toggleConfirmadasSection = () => {
    showConfirmadasSection.value = !showConfirmadasSection.value
  }

  const toggleHistorialSection = () => {
    showHistorialSection.value = !showHistorialSection.value
  }

  // Función para ir directamente a la sección de pendientes
  const verPendientes = () => {
    showPendientesSection.value = true
    // Hacer scroll a la sección de pendientes
    setTimeout(() => {
      const pendientesSection = document.querySelector('.card-section:nth-child(3)')
      if (pendientesSection) {
        pendientesSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  // Datos simulados para las citas
  const citasPendientes = ref<CitaPendiente[]>([
    {
      id: 1,
      estudiante: 'María Rodríguez',
      padre: 'Carlos Rodríguez',
      fecha: new Date(2025, 4, 5), // 5 de mayo de 2025
      hora: '15:30',
      motivo: 'Discutir el rendimiento académico del último trimestre',
    },
    {
      id: 2,
      estudiante: 'Juan Pérez',
      padre: 'Ana Pérez',
      fecha: new Date(2025, 4, 7), // 7 de mayo de 2025
      hora: '16:00',
      motivo: 'Consulta sobre el proyecto de ciencias',
    },
  ])

const citasConfirmadas = ref<CitaConfirmada[]>([
  {
    id: 3,
    estudiante: 'Laura Gómez',
    padre: 'Roberto Gómez',
    fecha: new Date(2025, 4, 10), // 10 de mayo de 2025
    hora: '14:00',
    motivo: 'Revisar el progreso en matemáticas y establecer plan de estudio',
    enlaceVideo: null, // Ya no se usa videollamada, las reuniones son presenciales
  },
  {
    id: 4,
    estudiante: 'Pedro Sánchez',
    padre: 'María Sánchez',
    fecha: new Date(2025, 4, 12), // 12 de mayo de 2025
    hora: '17:30',
    motivo: 'Discutir opciones para proyecto final de ciencias',
    enlaceVideo: null, // Ya no se usa videollamada, las reuniones son presenciales
  },
])

const citasHistorial = ref<CitaHistorial[]>([
  {
    id: 5,
    estudiante: 'Sofía Martínez',
    padre: 'Luis Martínez',
    fecha: new Date(2025, 3, 15), // 15 de abril de 2025
    estado: 'Completada',
  },
  {
    id: 6,
    estudiante: 'Diego López',
    padre: 'Carmen López',
    fecha: new Date(2025, 3, 20), // 20 de abril de 2025
    estado: 'Cancelada',
  },
  {
    id: 7,
    estudiante: 'Valentina Díaz',
    padre: 'Jorge Díaz',
    fecha: new Date(2025, 3, 25), // 25 de abril de 2025
    estado: 'No asistió',
  },
])

// Funciones para manejar las citas
const aceptarCita = (id: number): void => {
  console.log(`Cita aceptada: ${id}`)
  // Aquí iría la lógica para aceptar la cita
  // Por ejemplo, mover la cita de pendientes a confirmadas
  const index = citasPendientes.value.findIndex((cita) => cita.id === id)
  if (index !== -1) {
    const cita = citasPendientes.value[index]
    citasConfirmadas.value.push({
      id: cita.id,
      estudiante: cita.estudiante,
      padre: cita.padre,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      enlaceVideo: null, // Ya no se usa videollamada, las reuniones son presenciales
    })
    citasPendientes.value.splice(index, 1)
  }
}

const rechazarCita = (id: number): void => {
  console.log(`Cita rechazada: ${id}`)
  // Aquí iría la lógica para rechazar la cita
  const index = citasPendientes.value.findIndex((cita) => cita.id === id)
  if (index !== -1) {
    const cita = citasPendientes.value[index]
    citasHistorial.value.push({
      id: cita.id,
      estudiante: cita.estudiante,
      padre: cita.padre,
      fecha: cita.fecha,
      estado: 'Rechazada',
    })
    citasPendientes.value.splice(index, 1)
  }
}

// Función para responder a una cita
const responderCita = (id: number): void => {
  console.log(`Responder a cita: ${id}`)
  // Aquí iría la lógica para responder a la cita
  // Por ejemplo, mostrar un formulario para enviar un mensaje al padre
  const cita = citasPendientes.value.find((c) => c.id === id)
  if (cita) {
    alert(`Enviar respuesta a ${cita.padre} sobre la cita para ${cita.estudiante}`)
    // En una implementación real, aquí se abriría un modal o formulario
  }
}

// Estado para el modal de detalles
const showDetallesModal = ref(false)
const citaSeleccionada = ref<CitaConfirmada | null>(null)

const verDetallesCita = (id: number): void => {
  console.log(`Ver detalles de cita: ${id}`)
  // Buscar la cita en confirmadas
  const cita = citasConfirmadas.value.find((c) => c.id === id)
  if (cita) {
    // Guardar la cita seleccionada y mostrar el modal
    citaSeleccionada.value = cita
    showDetallesModal.value = true
  }
}

const cerrarDetallesModal = (): void => {
  showDetallesModal.value = false
  // Limpiar la cita seleccionada después de un breve retraso para la animación
  setTimeout(() => {
    citaSeleccionada.value = null
  }, 300)
}

// Estado para el modal de confirmación de eliminación
const showEliminarModal = ref(false)
const citaEliminarId = ref<number | null>(null)

// Función para mostrar el modal de confirmación de eliminación
const eliminarHistorial = (id: number): void => {
  console.log(`Solicitud para eliminar cita del historial: ${id}`)
  citaEliminarId.value = id
  showEliminarModal.value = true
}

// Función para confirmar la eliminación
const confirmarEliminarHistorial = (): void => {
  if (citaEliminarId.value !== null) {
    const index = citasHistorial.value.findIndex((cita) => cita.id === citaEliminarId.value)
    if (index !== -1) {
      citasHistorial.value.splice(index, 1)
      console.log(`Cita eliminada del historial: ${citaEliminarId.value}`)
    }
  }
  cerrarEliminarModal()
}

// Función para cerrar el modal de confirmación
const cerrarEliminarModal = (): void => {
  showEliminarModal.value = false
  // Limpiar el ID de la cita a eliminar después de un breve retraso para la animación
  setTimeout(() => {
    citaEliminarId.value = null
  }, 300)
}

// Función para formatear fechas
const formatDate = (date: Date): string => {
  return format(date, 'dd MMMM yyyy', { locale: es })
}

// Función para obtener la clase CSS según el estado de la cita
const getStatusClass = (estado: string): string => {
  switch (estado.toLowerCase()) {
    case 'completada':
      return 'status-completed'
    case 'cancelada':
      return 'status-cancelled'
    case 'no asistió':
      return 'status-no-show'
    case 'rechazada':
      return 'status-rejected'
    default:
      return ''
  }
}

  onMounted(() => {
    // Aquí se podrían cargar los datos desde una API
    console.log('Componente de citas montado')
  })

  return {
    citasPendientes,
    citasConfirmadas,
    citasHistorial,
    showPendientesSection,
    showConfirmadasSection,
    showHistorialSection,
    formattedCurrentDate,
    // Modal de detalles
    showDetallesModal,
    citaSeleccionada,
    cerrarDetallesModal,
    // Modal de eliminación
    showEliminarModal,
    confirmarEliminarHistorial,
    cerrarEliminarModal,
    // Funciones de navegación
    togglePendientesSection,
    toggleConfirmadasSection,
    toggleHistorialSection,
    verPendientes,
    // Funciones de acción
    verDetallesCita,
    eliminarHistorial,
    aceptarCita,
    rechazarCita,
    responderCita,
    // Funciones de utilidad
    formatDate,
    getStatusClass,
  }
}