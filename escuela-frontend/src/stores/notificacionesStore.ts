import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notificacion } from '@/composables/dashboards/useNotificaciones'

export const useNotificacionesStore = defineStore('notificaciones', () => {
  // Estado
  const notificaciones = ref<Notificacion[]>([
    {
      id: 1,
      titulo: 'Nueva solicitud de cita',
      mensaje: 'El padre de María Rodríguez ha solicitado una cita para el próximo viernes.',
      fecha: new Date(2025, 4, 2, 14, 30), // 2 de mayo de 2025, 14:30
      tipo: 'cita',
      leida: false,
      destinatarios: ['profesor'],
      accionable: true,
      accionTexto: 'Ver detalles de la cita',
      accionIcono: 'calendar-alt'
    },
    {
      id: 2,
      titulo: 'Recordatorio de entrega de notas',
      mensaje: 'Recuerde que debe entregar las notas del primer trimestre antes del 15 de mayo.',
      fecha: new Date(2025, 4, 1, 9, 15), // 1 de mayo de 2025, 9:15
      tipo: 'sistema',
      leida: false,
      destinatarios: ['profesor', 'direccion']
    },
    {
      id: 3,
      titulo: 'Material nuevo disponible',
      mensaje: 'Se ha añadido nuevo material didáctico para el curso de matemáticas.',
      fecha: new Date(2025, 3, 30, 11, 45), // 30 de abril de 2025, 11:45
      tipo: 'material',
      leida: true,
      destinatarios: ['profesor'],
      accionable: true,
      accionTexto: 'Ver material',
      accionIcono: 'book'
    },
    {
      id: 4,
      titulo: 'Evento: Reunión de profesores',
      mensaje: 'Recordatorio de la reunión de profesores programada para mañana a las 3:00 PM.',
      fecha: new Date(2025, 3, 28, 16, 0), // 28 de abril de 2025, 16:00
      tipo: 'calendario',
      leida: true,
      destinatarios: ['profesor', 'direccion'],
      accionable: true,
      accionTexto: 'Ver en calendario',
      accionIcono: 'calendar-alt'
    },
    {
      id: 5,
      titulo: 'Actualización del sistema',
      mensaje: 'El sistema se actualizará esta noche a las 22:00. Podría experimentar interrupciones temporales.',
      fecha: new Date(2025, 3, 25, 10, 30), // 25 de abril de 2025, 10:30
      tipo: 'sistema',
      leida: true,
      destinatarios: ['todos']
    },
    {
      id: 6,
      titulo: 'Alerta: Cierre por emergencia',
      mensaje: 'Debido a condiciones climáticas adversas, la escuela permanecerá cerrada mañana.',
      fecha: new Date(2025, 4, 5, 18, 0), // 5 de mayo de 2025, 18:00
      tipo: 'alerta',
      leida: false,
      destinatarios: ['todos'],
      accionable: true,
      accionTexto: 'Ver detalles',
      accionIcono: 'exclamation-triangle'
    },
    {
      id: 7,
      titulo: 'Mensaje de la dirección',
      mensaje: 'Se solicita a todos los profesores enviar sus planificaciones para el próximo mes.',
      fecha: new Date(2025, 4, 4, 10, 15), // 4 de mayo de 2025, 10:15
      tipo: 'mensaje',
      leida: false,
      destinatarios: ['profesor'],
      accionable: true,
      accionTexto: 'Responder',
      accionIcono: 'reply'
    }
  ])

  // Getters
  const notificacionesNoLeidas = computed(() => {
    return notificaciones.value.filter(n => !n.leida)
  })

  const cantidadNoLeidas = computed(() => {
    return notificacionesNoLeidas.value.length
  })

  const notificacionesFiltradas = computed(() => {
    return (estado: string, tipo: string) => {
      let resultado = [...notificaciones.value]
      
      // Filtrar por estado
      if (estado === 'leidas') {
        resultado = resultado.filter(n => n.leida)
      } else if (estado === 'no-leidas') {
        resultado = resultado.filter(n => !n.leida)
      }
      
      // Filtrar por tipo
      if (tipo !== 'todas') {
        resultado = resultado.filter(n => n.tipo === tipo)
      }
      
      // Ordenar por fecha (más reciente primero)
      return resultado.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    }
  })

  // Acciones
  function marcarComoLeida(id: number) {
    const index = notificaciones.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notificaciones.value[index].leida = true
    }
  }

  function marcarTodasComoLeidas() {
    notificaciones.value.forEach(n => {
      n.leida = true
    })
  }

  function eliminarNotificacion(id: number) {
    const index = notificaciones.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notificaciones.value.splice(index, 1)
    }
  }

  function agregarNotificacion(notificacion: Omit<Notificacion, 'id'>) {
    const newId = notificaciones.value.length > 0 
      ? Math.max(...notificaciones.value.map(n => n.id)) + 1 
      : 1
    
    notificaciones.value.push({
      id: newId,
      ...notificacion
    })
  }

  return {
    notificaciones,
    notificacionesNoLeidas,
    cantidadNoLeidas,
    notificacionesFiltradas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    agregarNotificacion
  }
})
