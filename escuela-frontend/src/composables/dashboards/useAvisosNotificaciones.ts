import { ref, computed, watch, onMounted } from 'vue'
import { useNotificacionesStore } from '@/stores/notificacionesStore'
import { useAvisosStore } from '@/stores/avisos.store'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date'
import type { Notificacion, TipoNotificacion } from '@/composables/dashboards/useNotificaciones'
import type { Aviso } from '@/services/avisos.service'

// Interfaz para el estado de lectura de los avisos
interface AvisoLeido {
  id_aviso: string
  leido: boolean
}

export function useAvisosNotificaciones(userRole: string = 'direccion') {
  // Usar las stores
  const notificacionesStore = useNotificacionesStore()
  const avisosStore = useAvisosStore()
  const { avisos } = storeToRefs(avisosStore)
  
  // Estado local para los avisos leídos
  const avisosLeidos = ref<AvisoLeido[]>([])
  
  // Cargar estado de lectura de avisos desde localStorage al iniciar
  onMounted(() => {
    const avisosLeidosGuardados = localStorage.getItem(`avisos-leidos-${userRole}`)
    if (avisosLeidosGuardados) {
      avisosLeidos.value = JSON.parse(avisosLeidosGuardados)
    }
  })
  
  // Guardar estado de lectura en localStorage cuando cambie
  watch(avisosLeidos, (newValue) => {
    localStorage.setItem(`avisos-leidos-${userRole}`, JSON.stringify(newValue))
  }, { deep: true })
  
  // Convertir avisos a formato de notificaciones
  const avisosComoNotificaciones = computed(() => {
    return avisos.value.map(aviso => {
      // Verificar si este aviso ya está marcado como leído
      const avisoLeido = avisosLeidos.value.find(al => al.id_aviso === aviso.id_aviso)
      
      return {
        id: parseInt(aviso.id_aviso) || Date.now(), // Convertir a número o usar timestamp actual como fallback
        titulo: aviso.titulo,
        mensaje: aviso.contenido,
        fecha: new Date(aviso.fecha_envio),
        tipo: 'aviso' as TipoNotificacion,
        leida: avisoLeido ? avisoLeido.leido : false,
        destinatarios: [aviso.destinatario === 'todos' ? 'todos' : userRole],
        accionable: true,
        accionTexto: 'Ver aviso',
        accionIcono: 'arrow-right',
        accion: 'ver-aviso',
        avisoId: aviso.id_aviso // Guardar el ID original del aviso para referencia
      }
    }).filter(aviso => {
      // Filtrar avisos según el rol del usuario
      return aviso.destinatarios.includes('todos') || aviso.destinatarios.includes(userRole)
    })
  })
  
  // Combinar notificaciones del sistema con avisos
  const todasLasNotificaciones = computed(() => {
    return [...notificacionesStore.notificaciones, ...avisosComoNotificaciones.value]
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime()) // Ordenar por fecha, más recientes primero
  })
  
  // Contar notificaciones no leídas (incluyendo avisos)
  const cantidadNoLeidas = computed(() => {
    return todasLasNotificaciones.value.filter(n => !n.leida).length
  })
  
  // Marcar un aviso como leído
  function marcarAvisoComoLeido(avisoId: string) {
    const index = avisosLeidos.value.findIndex(al => al.id_aviso === avisoId)
    
    if (index !== -1) {
      // Actualizar si ya existe
      avisosLeidos.value[index].leido = true
    } else {
      // Agregar nuevo registro
      avisosLeidos.value.push({
        id_aviso: avisoId,
        leido: true
      })
    }
  }
  
  // Marcar todos los avisos como leídos
  function marcarTodosAvisosComoLeidos() {
    avisos.value.forEach(aviso => {
      marcarAvisoComoLeido(aviso.id_aviso)
    })
  }
  
  // Formatear fecha para mostrar
  function formatearFecha(fecha: Date): string {
    const ahora = new Date()
    const diferenciaMilisegundos = ahora.getTime() - fecha.getTime()
    const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60)
    
    if (diferenciaHoras < 24) {
      // Si es menos de 24 horas, mostrar "Hoy a las HH:MM"
      return `Hoy a las ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`
    } else if (diferenciaHoras < 48) {
      // Si es menos de 48 horas, mostrar "Ayer a las HH:MM"
      return `Ayer a las ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`
    } else {
      // En otro caso, mostrar la fecha completa
      return formatDate(fecha)
    }
  }
  
  // Obtener el ícono correspondiente al tipo de notificación
  function obtenerIcono(tipo: TipoNotificacion): string {
    const iconos: Record<TipoNotificacion, string> = {
      'sistema': 'cog',
      'cita': 'calendar-alt',
      'material': 'book',
      'calendario': 'calendar-alt',
      'mensaje': 'envelope',
      'alerta': 'exclamation-triangle',
      'aviso': 'bell'
    }
    
    return iconos[tipo] || 'bell'
  }
  
  return {
    notificacionesStore,
    avisosStore,
    todasLasNotificaciones,
    cantidadNoLeidas,
    marcarAvisoComoLeido,
    marcarTodosAvisosComoLeidos,
    formatearFecha,
    obtenerIcono
  }
}
