import { ref, computed } from 'vue'
import { useNotificacionesStore } from '@/stores/notificacionesStore'
import { useAvisosStore } from '@/stores/avisos.store'
import { storeToRefs } from 'pinia'
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
export type TipoNotificacion = 'sistema' | 'cita' | 'material' | 'calendario' | 'mensaje' | 'alerta' | 'aviso'
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
  avisoId?: string  // ID del aviso original si la notificación es de tipo 'aviso'
}

export function useNotificaciones(userRole: string = 'profesor') {
  // Usar las stores
  const notificacionesStore = useNotificacionesStore()
  const avisosStore = useAvisosStore()
  const { avisos } = storeToRefs(avisosStore)

  // Filtros
  const filtroEstado = ref<EstadoNotificacion>('todas')
  const filtroTipo = ref<string>('todas')

  // Computed properties
  const notificacionesFiltradas = computed(() => {
    let resultado = [...notificacionesStore.notificaciones]
    
    // Agregar avisos como notificaciones
    const avisosComoNotificaciones = avisos.value.map(aviso => ({
      id: parseInt(aviso.id_aviso) || Date.now(), // Convertir a número o usar timestamp actual como fallback
      titulo: aviso.titulo,
      mensaje: aviso.contenido,
      fecha: new Date(aviso.fecha_envio),
      tipo: 'aviso' as TipoNotificacion,
      leida: false, // TODO: Implementar estado de leído para avisos
      destinatarios: [aviso.destinatario === 'todos' ? 'todos' : userRole],
      accionable: true,
      accionTexto: 'Ver aviso',
      accionIcono: 'arrow-right',
      accion: 'ver-aviso'
    }))
    
    resultado = [...resultado, ...avisosComoNotificaciones]
    
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
    const iconos = {
      sistema: 'cog',
      cita: 'calendar-alt',
      material: 'book',
      calendario: 'calendar-alt',
      mensaje: 'envelope',
      alerta: 'exclamation-triangle',
      aviso: 'bell'
    }
    return iconos[tipo] || 'bell'
  }

  const formatearFecha = (fecha: Date): string => {
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()
    const minutos = Math.floor(diferencia / 60000)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (minutos < 60) {
      return `Hace ${minutos} minutos`
    } else if (horas < 24) {
      return `Hace ${horas} horas`
    } else if (dias === 1) {
      return 'Ayer'
    } else if (dias < 7) {
      return `Hace ${dias} días`
    } else {
      return fecha.toLocaleDateString()
    }
  }

  return {
    // Estado
    filtroEstado,
    filtroTipo,
    notificacionesFiltradas,
    notificacionesStore,

    // Métodos
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    obtenerIcono,
    formatearFecha
  }
}
