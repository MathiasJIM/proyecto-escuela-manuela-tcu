import { ref, reactive } from 'vue'

// Definir la interfaz para los eventos
export interface Evento {
  id?: number
  start: string
  end: string
  title: string
  content?: string
  class?: string
}

export function useCalendar() {
  // Estado del calendario
  const vuecal = ref(null)
  const showModal = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')
  const currentEvent = reactive<Evento>({
    start: '',
    end: '',
    title: '',
    content: '',
    class: 'event-blue'
  })
  const selectedEventId = ref<number | null>(null)

  // Variables para los campos de fecha y hora separados
  const eventStartDate = ref('')
  const eventStartTime = ref('')
  const eventEndDate = ref('')
  const eventEndTime = ref('')

  // Generar opciones de hora (cada 30 minutos desde 7:00 hasta 19:00)
  const timeOptions = ref<string[]>([])

  // Generar las opciones de hora al iniciar el componente
  for (let hour = 7; hour <= 19; hour++) {
    const hourStr = hour.toString().padStart(2, '0')
    timeOptions.value.push(`${hourStr}:00`)
    timeOptions.value.push(`${hourStr}:30`)
  }

  // Datos de prueba para eventos
  const eventos = ref<Evento[]>([
    {
      id: 1,
      start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
      end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      title: 'Reunión de profesores',
      content: 'Discusión sobre el plan de estudios del próximo trimestre',
      class: 'event-blue'
    },
    {
      id: 2,
      start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 0, 0, 0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 30, 0, 0).toString(),
      title: 'Entrega de notas',
      content: 'Entrega de calificaciones del primer trimestre',
      class: 'event-green'
    },
    {
      id: 3,
      start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(14, 0, 0, 0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(15, 30, 0, 0).toString(),
      title: 'Reunión con padres',
      content: 'Atención a padres de familia para discutir el progreso de los estudiantes',
      class: 'event-orange'
    }
  ])

  // Función para formatear la hora para mostrar en el dropdown
  function formatTimeDisplay(time: string): string {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Función para mostrar el modal
  function showEventModal(mode: 'create' | 'edit', event?: Evento) {
    modalMode.value = mode
    
    if (mode === 'create') {
      // Inicializar un nuevo evento
      const now = new Date()
      const startDate = new Date(now)
      startDate.setMinutes(Math.ceil(now.getMinutes() / 30) * 30) // Redondear a la media hora más cercana
      
      const endDate = new Date(startDate)
      endDate.setHours(endDate.getHours() + 1)
      
      // Establecer valores para los campos separados de fecha y hora
      eventStartDate.value = startDate.toISOString().slice(0, 10) // YYYY-MM-DD
      eventStartTime.value = startDate.toISOString().slice(11, 16) // HH:MM
      eventEndDate.value = endDate.toISOString().slice(0, 10) // YYYY-MM-DD
      eventEndTime.value = endDate.toISOString().slice(11, 16) // HH:MM
      
      // También actualizar el objeto de evento para mantener la coherencia
      currentEvent.start = startDate.toISOString()
      currentEvent.end = endDate.toISOString()
      currentEvent.title = ''
      currentEvent.content = ''
      currentEvent.class = 'event-blue'
      selectedEventId.value = null
    } else if (event) {
      // Editar un evento existente
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)
      
      selectedEventId.value = event.id || null
      
      // Establecer valores para los campos separados de fecha y hora
      eventStartDate.value = startDate.toISOString().slice(0, 10) // YYYY-MM-DD
      eventStartTime.value = startDate.toISOString().slice(11, 16) // HH:MM
      eventEndDate.value = endDate.toISOString().slice(0, 10) // YYYY-MM-DD
      eventEndTime.value = endDate.toISOString().slice(11, 16) // HH:MM
      
      // También actualizar el objeto de evento para mantener la coherencia
      currentEvent.start = startDate.toISOString()
      currentEvent.end = endDate.toISOString()
      currentEvent.title = event.title
      currentEvent.content = event.content || ''
      currentEvent.class = event.class || 'event-blue'
    }
    
    showModal.value = true
  }

  // Función para cerrar el modal
  function closeModal() {
    showModal.value = false
  }

  // Función para guardar un evento (crear o actualizar)
  function saveEvent() {
    if (!currentEvent.title) {
      alert('Por favor ingrese un título para el evento')
      return
    }
    
    // Combinar fecha y hora para crear timestamps ISO
    const startDateTime = new Date(`${eventStartDate.value}T${eventStartTime.value}:00`)
    const endDateTime = new Date(`${eventEndDate.value}T${eventEndTime.value}:00`)
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (endDateTime <= startDateTime) {
      alert('La fecha y hora de fin debe ser posterior a la fecha y hora de inicio')
      return
    }
    
    if (modalMode.value === 'create') {
      // Crear un nuevo evento
      const newEvent: Evento = {
        id: Date.now(), // Generar un ID único
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        title: currentEvent.title,
        content: currentEvent.content,
        class: currentEvent.class
      }
      
      eventos.value.push(newEvent)
      console.log('Evento creado:', newEvent)
    } else {
      // Actualizar un evento existente
      const index = eventos.value.findIndex(e => e.id === selectedEventId.value)
      if (index !== -1) {
        const updatedEvent = {
          ...eventos.value[index],
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          title: currentEvent.title,
          content: currentEvent.content,
          class: currentEvent.class
        }
        
        eventos.value[index] = updatedEvent
        console.log('Evento actualizado:', updatedEvent)
      }
    }
    
    closeModal()
  }

  // Función para manejar el clic en un evento
  function onEventClick(event: Evento, e: MouseEvent) {
    e.stopPropagation()
    showEventModal('edit', event)
  }

  // Funciones requeridas para interactuar con vue-cal
  function crearEvento(event: Evento) {
    console.log('Evento creado:', event)
    return event
  }

  function actualizarEvento(event: Evento, oldEvent: Evento) {
    console.log('Evento actualizado:', event, 'Evento anterior:', oldEvent)
    return event
  }

  function eliminarEvento(event: Evento) {
    console.log('Evento eliminado:', event)
    
    // Eliminar el evento del array
    const index = eventos.value.findIndex(e => e.id === event.id)
    if (index !== -1) {
      eventos.value.splice(index, 1)
    }
  }

  return {
    vuecal,
    showModal,
    modalMode,
    currentEvent,
    selectedEventId,
    eventStartDate,
    eventStartTime,
    eventEndDate,
    eventEndTime,
    timeOptions,
    eventos,
    formatTimeDisplay,
    showEventModal,
    closeModal,
    saveEvent,
    onEventClick,
    crearEvento,
    actualizarEvento,
    eliminarEvento
  }
}