import { ref, computed } from 'vue'
import { useNotificacionesStore } from '@/stores/notificacionesStore'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faBell, 
  faCheck, 
  faCheckDouble, 
  faTrash, 
  faBellSlash, 
  faCalendarAlt, 
  faBook, 
  faUsers, 
  faCog,
  faChevronDown,
  faEnvelope,
  faExclamationTriangle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

// Registrar los íconos
library.add(
  faBell, 
  faCheck, 
  faCheckDouble, 
  faTrash, 
  faBellSlash, 
  faCalendarAlt, 
  faBook, 
  faUsers, 
  faCog,
  faChevronDown,
  faEnvelope,
  faExclamationTriangle,
  faArrowRight
)

// Tipos de notificación
export type TipoNotificacion = 'sistema' | 'cita' | 'material' | 'calendario' | 'mensaje' | 'alerta'
export type EstadoNotificacion = 'leida' | 'no-leida' | 'todas'

// Interfaz para notificaciones
export interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  fecha: Date
  tipo: TipoNotificacion
  leida: boolean
  destinatarios: string[]
  accionable?: boolean
  accionTexto?: string
  accionIcono?: string
  accion?: string
}

export function useNotificaciones(userRole: string = 'profesor') {
  // Usar la store de notificaciones
  const notificacionesStore = useNotificacionesStore()

  // Filtros
  const filtroEstado = ref<EstadoNotificacion>('todas')
  const filtroTipo = ref<string>('todas')

  // Computed properties
  const notificacionesFiltradas = computed(() => {
    let resultado = [...notificacionesStore.notificaciones]
    
    // Filtrar por estado
    if (filtroEstado.value === 'leida') {
      resultado = resultado.filter(n => n.leida)
    } else if (filtroEstado.value === 'no-leida') {
      resultado = resultado.filter(n => !n.leida)
    }
    
    // Filtrar por tipo
    if (filtroTipo.value !== 'todas') {
      resultado = resultado.filter(n => n.tipo === filtroTipo.value)
    }
    
    // Filtrar por rol de usuario
    resultado = resultado.filter(n => 
      n.destinatarios.includes(userRole) || 
      n.destinatarios.includes('todos')
    )
    
    // Ordenar por fecha (más recientes primero)
    return resultado.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )
  })

  // Métodos
  const marcarComoLeida = (id: number) => {
    notificacionesStore.marcarComoLeida(id)
  }

  const marcarTodasComoLeidas = () => {
    notificacionesStore.marcarTodasComoLeidas()
  }

  const eliminarNotificacion = (id: number) => {
    notificacionesStore.eliminarNotificacion(id)
  }

  const obtenerIcono = (tipo: TipoNotificacion): string => {
    switch (tipo) {
      case 'cita':
        return 'users'
      case 'material':
        return 'book'
      case 'calendario':
        return 'calendar-alt'
      case 'mensaje':
        return 'envelope'
      case 'alerta':
        return 'exclamation-triangle'
      case 'sistema':
      default:
        return 'cog'
    }
  }

  const formatearFecha = (fecha: Date): string => {
    const hoy = new Date()
    const ayer = new Date(hoy)
    ayer.setDate(ayer.getDate() - 1)
    
    const esHoy = fecha.getDate() === hoy.getDate() && 
                  fecha.getMonth() === hoy.getMonth() && 
                  fecha.getFullYear() === hoy.getFullYear()
    
    const esAyer = fecha.getDate() === ayer.getDate() && 
                   fecha.getMonth() === ayer.getMonth() && 
                   fecha.getFullYear() === ayer.getFullYear()
    
    const opciones: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit'
    }
    
    let fechaFormateada = ''
    
    if (esHoy) {
      fechaFormateada = `Hoy, ${fecha.toLocaleTimeString('es-ES', opciones)}`
    } else if (esAyer) {
      fechaFormateada = `Ayer, ${fecha.toLocaleTimeString('es-ES', opciones)}`
    } else {
      opciones.day = '2-digit'
      opciones.month = '2-digit'
      opciones.year = 'numeric'
      fechaFormateada = fecha.toLocaleDateString('es-ES', opciones)
    }
    
    return fechaFormateada
  }

  return {
    filtroEstado,
    filtroTipo,
    notificacionesFiltradas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    obtenerIcono,
    formatearFecha,
    notificacionesStore
  }
}