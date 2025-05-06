import { ref, computed } from 'vue'

// Definición de interfaces para mejorar el tipado
export interface Profesor {
  nombreCompleto: string
  email: string
  secciones: string[]
  materias: string[]
}

export interface HorarioItem {
  nombre: string
  horaInicio: string
  horaFin: string
  sinAtencion: boolean
}

export interface Message {
  type: 'success' | 'error'
  text: string
}

export function usePerfil() {
  // Fecha actual formateada
  const formattedDate = computed(() => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return now.toLocaleDateString('es-ES', options)
  })

  // Datos simulados del profesor
  const profesor = ref<Profesor>({
    nombreCompleto: 'Maricela Prendas Vargas',
    email: 'maricela.prendas@escuelamanuela.edu',
    secciones: ['2-A', '3-B', '5-C'],
    materias: ['Matemáticas', 'Ciencias', 'Estudios Sociales'],
  })

  // Estado para el formulario de horarios de atención
  const horarios = ref<HorarioItem[]>([
    { nombre: 'Lunes', horaInicio: '13:00', horaFin: '15:00', sinAtencion: false },
    { nombre: 'Martes', horaInicio: '13:00', horaFin: '15:00', sinAtencion: false },
    { nombre: 'Miércoles', horaInicio: '13:00', horaFin: '15:00', sinAtencion: false },
    { nombre: 'Jueves', horaInicio: '13:00', horaFin: '15:00', sinAtencion: false },
    { nombre: 'Viernes', horaInicio: '13:00', horaFin: '15:00', sinAtencion: false },
  ])

  const isHorarioLoading = ref<boolean>(false)
  const horarioMessage = ref<Message | null>(null)

  // Guardar horarios de atención
  const guardarHorarios = (): void => {
    isHorarioLoading.value = true

    // Simulamos una petición al servidor
    setTimeout(() => {
      isHorarioLoading.value = false
      horarioMessage.value = {
        type: 'success',
        text: 'Horarios guardados correctamente',
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        horarioMessage.value = null
      }, 3000)
    }, 1500)
  }

  return {
    formattedDate,
    profesor,
    horarios,
    isHorarioLoading,
    horarioMessage,
    guardarHorarios
  }
}
