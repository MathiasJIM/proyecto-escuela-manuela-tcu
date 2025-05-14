import { ref, computed } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faArrowRight, 
  faCheck, 
  faXmark, 
  faTimes, 
  faCalendarAlt,
  faUserGraduate,
  faExclamationTriangle,
  faCheckCircle,
  faUsers,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons'

// Registrar los iconos
library.add(
  faArrowRight, 
  faCheck, 
  faXmark, 
  faTimes, 
  faCalendarAlt,
  faUserGraduate,
  faExclamationTriangle,
  faCheckCircle,
  faUsers,
  faChalkboardTeacher
)

// Definición de interfaces
interface Estudiante {
  id: number
  nombreCompleto: string
  seccionId: number
  seleccionado: boolean
}

interface Seccion {
  id: number
  nombre: string
  anioLectivoId: number
  estudiantes: Estudiante[]
  seccionDestinoId: number | null
  promocionarTodos: boolean
}

interface AnioLectivo {
  id: number
  anio: number
  fechaInicio: string
  fechaFin: string
  activo: boolean
  secciones: Seccion[]
}

export default function usePromocionarEstudiantes() {
  // Datos de ejemplo
  const aniosLectivos = ref<AnioLectivo[]>([
    {
      id: 1,
      anio: 2023,
      fechaInicio: '2023-02-01',
      fechaFin: '2023-11-30',
      activo: false,
      secciones: [
        {
          id: 1,
          nombre: '1A',
          anioLectivoId: 1,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: [
            { id: 1, nombreCompleto: 'Ana García', seccionId: 1, seleccionado: true },
            { id: 2, nombreCompleto: 'Carlos Pérez', seccionId: 1, seleccionado: true },
            { id: 3, nombreCompleto: 'María López', seccionId: 1, seleccionado: true },
            { id: 4, nombreCompleto: 'Juan Rodríguez', seccionId: 1, seleccionado: true },
            { id: 5, nombreCompleto: 'Sofía Martínez', seccionId: 1, seleccionado: true }
          ]
        },
        {
          id: 2,
          nombre: '1B',
          anioLectivoId: 1,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: [
            { id: 6, nombreCompleto: 'Pedro Sánchez', seccionId: 2, seleccionado: true },
            { id: 7, nombreCompleto: 'Lucía González', seccionId: 2, seleccionado: true },
            { id: 8, nombreCompleto: 'Daniel Torres', seccionId: 2, seleccionado: true },
            { id: 9, nombreCompleto: 'Valentina Díaz', seccionId: 2, seleccionado: true },
            { id: 10, nombreCompleto: 'Mateo Ruiz', seccionId: 2, seleccionado: true }
          ]
        },
        {
          id: 3,
          nombre: '2A',
          anioLectivoId: 1,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: [
            { id: 11, nombreCompleto: 'Isabella Morales', seccionId: 3, seleccionado: true },
            { id: 12, nombreCompleto: 'Santiago Jiménez', seccionId: 3, seleccionado: true },
            { id: 13, nombreCompleto: 'Camila Vargas', seccionId: 3, seleccionado: true },
            { id: 14, nombreCompleto: 'Sebastián Castro', seccionId: 3, seleccionado: true },
            { id: 15, nombreCompleto: 'Valeria Herrera', seccionId: 3, seleccionado: true }
          ]
        }
      ]
    },
    {
      id: 2,
      anio: 2024,
      fechaInicio: '2024-02-05',
      fechaFin: '2024-12-05',
      activo: true,
      secciones: [
        {
          id: 4,
          nombre: '1A',
          anioLectivoId: 2,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        },
        {
          id: 5,
          nombre: '1B',
          anioLectivoId: 2,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        },
        {
          id: 6,
          nombre: '2A',
          anioLectivoId: 2,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        },
        {
          id: 7,
          nombre: '2B',
          anioLectivoId: 2,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        },
        {
          id: 8,
          nombre: '3A',
          anioLectivoId: 2,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        }
      ]
    },
    {
      id: 3,
      anio: 2025,
      fechaInicio: '2025-02-03',
      fechaFin: '2025-11-28',
      activo: false,
      secciones: [
        {
          id: 9,
          nombre: '1A',
          anioLectivoId: 3,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        },
        {
          id: 10,
          nombre: '2A',
          anioLectivoId: 3,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        },
        {
          id: 11,
          nombre: '3A',
          anioLectivoId: 3,
          seccionDestinoId: null,
          promocionarTodos: true,
          estudiantes: []
        }
      ]
    }
  ])

  // Estado para selección de años
  const anioOrigenId = ref<number | null>(null)
  const anioDestinoId = ref<number | null>(null)

  // Estado para el modal de selección de estudiantes
  const showEstudiantesModal = ref(false)
  const seccionSeleccionada = ref<Seccion | null>(null)

  // Obtener año origen seleccionado
  const anioOrigen = computed(() => {
    if (!anioOrigenId.value) return null
    return aniosLectivos.value.find(a => a.id === anioOrigenId.value) || null
  })

  // Obtener año destino seleccionado
  const anioDestino = computed(() => {
    if (!anioDestinoId.value) return null
    return aniosLectivos.value.find(a => a.id === anioDestinoId.value) || null
  })

  // Obtener secciones del año origen
  const seccionesOrigen = computed(() => {
    if (!anioOrigen.value) return []
    return anioOrigen.value.secciones
  })

  // Obtener secciones del año destino
  const seccionesDestino = computed(() => {
    if (!anioDestino.value) return []
    return anioDestino.value.secciones
  })

  // Obtener años disponibles para origen (todos excepto el actual)
  const aniosDisponiblesOrigen = computed(() => {
    return aniosLectivos.value.filter(a => !a.activo)
  })

  // Obtener años disponibles para destino (solo el actual o posteriores al origen)
  const aniosDisponiblesDestino = computed(() => {
    if (!anioOrigenId.value) return []
    const anioOrigenSeleccionado = aniosLectivos.value.find(a => a.id === anioOrigenId.value)
    if (!anioOrigenSeleccionado) return []
    
    return aniosLectivos.value.filter(a => 
      a.anio > anioOrigenSeleccionado.anio || a.activo
    )
  })

  // Verificar si hay errores en la configuración
  const errores = computed(() => {
    const listaErrores: string[] = []
    
    if (!anioOrigenId.value) {
      listaErrores.push('Debe seleccionar un año de origen')
    }
    
    if (!anioDestinoId.value) {
      listaErrores.push('Debe seleccionar un año de destino')
    }
    
    if (anioOrigenId.value && anioDestinoId.value) {
      // Verificar que todas las secciones tengan un destino asignado
      const seccionesSinDestino = seccionesOrigen.value.filter(s => s.seccionDestinoId === null)
      if (seccionesSinDestino.length > 0) {
        listaErrores.push(`Hay ${seccionesSinDestino.length} secciones sin destino asignado`)
      }
      
      // Verificar que no haya duplicación de destinos
      const destinosAsignados = seccionesOrigen.value
        .filter(s => s.seccionDestinoId !== null)
        .map(s => s.seccionDestinoId)
      
      const destinosDuplicados = destinosAsignados.filter(
        (destino, index) => destinosAsignados.indexOf(destino) !== index
      )
      
      if (destinosDuplicados.length > 0) {
        listaErrores.push('Hay secciones asignadas al mismo destino')
      }
    }
    
    return listaErrores
  })

  // Verificar si se puede promocionar
  const puedePromocionar = computed(() => {
    return errores.value.length === 0
  })

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    alert(`${tipo.toUpperCase()}: ${mensaje}`)
  }

  // Seleccionar año origen
  const seleccionarAnioOrigen = (id: number) => {
    anioOrigenId.value = id
    
    // Si el año destino no está seleccionado, seleccionar el año activo por defecto
    if (!anioDestinoId.value) {
      const anioActivo = aniosLectivos.value.find(a => a.activo)
      if (anioActivo) {
        anioDestinoId.value = anioActivo.id
      }
    }
    
    // Resetear las secciones destino
    if (anioOrigen.value) {
      anioOrigen.value.secciones.forEach(seccion => {
        seccion.seccionDestinoId = null
      })
    }
  }

  // Seleccionar año destino
  const seleccionarAnioDestino = (id: number) => {
    anioDestinoId.value = id
    
    // Resetear las secciones destino
    if (anioOrigen.value) {
      anioOrigen.value.secciones.forEach(seccion => {
        seccion.seccionDestinoId = null
      })
    }
  }

  // Seleccionar sección destino
  const seleccionarSeccionDestino = (seccionOrigenId: number, seccionDestinoId: number) => {
    if (!anioOrigen.value) return
    
    const seccion = anioOrigen.value.secciones.find(s => s.id === seccionOrigenId)
    if (seccion) {
      seccion.seccionDestinoId = seccionDestinoId
    }
  }

  // Cambiar estado de promocionar todos
  const cambiarPromocionarTodos = (seccionId: number, valor: boolean) => {
    if (!anioOrigen.value) return
    
    const seccion = anioOrigen.value.secciones.find(s => s.id === seccionId)
    if (seccion) {
      seccion.promocionarTodos = valor
      
      // Si se activa promocionar todos, seleccionar todos los estudiantes
      if (valor) {
        seccion.estudiantes.forEach(estudiante => {
          estudiante.seleccionado = true
        })
      }
    }
  }

  // Abrir modal de selección de estudiantes
  const abrirModalEstudiantes = (seccionId: number) => {
    if (!anioOrigen.value) return
    
    const seccion = anioOrigen.value.secciones.find(s => s.id === seccionId)
    if (seccion) {
      seccionSeleccionada.value = seccion
      showEstudiantesModal.value = true
    }
  }

  // Cerrar modal de selección de estudiantes
  const cerrarModalEstudiantes = () => {
    showEstudiantesModal.value = false
    seccionSeleccionada.value = null
  }

  // Seleccionar/deseleccionar estudiante
  const toggleEstudiante = (estudianteId: number) => {
    if (!seccionSeleccionada.value) return
    
    const estudiante = seccionSeleccionada.value.estudiantes.find(e => e.id === estudianteId)
    if (estudiante) {
      estudiante.seleccionado = !estudiante.seleccionado
    }
  }

  // Seleccionar todos los estudiantes
  const seleccionarTodosEstudiantes = () => {
    if (!seccionSeleccionada.value) return
    
    seccionSeleccionada.value.estudiantes.forEach(estudiante => {
      estudiante.seleccionado = true
    })
  }

  // Deseleccionar todos los estudiantes
  const deseleccionarTodosEstudiantes = () => {
    if (!seccionSeleccionada.value) return
    
    seccionSeleccionada.value.estudiantes.forEach(estudiante => {
      estudiante.seleccionado = false
    })
  }

  // Promocionar estudiantes
  const promocionarEstudiantes = () => {
    if (!puedePromocionar.value) {
      mostrarNotificacion('Hay errores en la configuración. Por favor, revise y corrija antes de continuar.', 'error')
      return
    }
    
    if (!anioOrigen.value || !anioDestino.value) {
      mostrarNotificacion('Debe seleccionar años de origen y destino', 'error')
      return
    }
    
    // Aquí iría la lógica para promocionar los estudiantes
    // En un entorno real, esto enviaría los datos al backend
    
    // Para la demostración, solo mostraremos un mensaje de éxito
    const totalEstudiantes = seccionesOrigen.value.reduce((total, seccion) => {
      if (seccion.promocionarTodos) {
        return total + seccion.estudiantes.length
      } else {
        return total + seccion.estudiantes.filter(e => e.seleccionado).length
      }
    }, 0)
    
    mostrarNotificacion(`Se han promocionado ${totalEstudiantes} estudiantes exitosamente`, 'success')
  }

  // Obtener cantidad de estudiantes seleccionados por sección
  const estudiantesSeleccionados = (seccionId: number) => {
    if (!anioOrigen.value) return 0
    
    const seccion = anioOrigen.value.secciones.find(s => s.id === seccionId)
    if (!seccion) return 0
    
    if (seccion.promocionarTodos) {
      return seccion.estudiantes.length
    } else {
      return seccion.estudiantes.filter(e => e.seleccionado).length
    }
  }

  // Obtener nombre de la sección destino
  const nombreSeccionDestino = (seccionDestinoId: number | null) => {
    if (!seccionDestinoId || !anioDestino.value) return 'No asignada'
    
    const seccion = anioDestino.value.secciones.find(s => s.id === seccionDestinoId)
    return seccion ? seccion.nombre : 'No asignada'
  }

  // Resetear formulario
  const resetearFormulario = () => {
    anioOrigenId.value = null
    anioDestinoId.value = null
    
    // Resetear secciones
    aniosLectivos.value.forEach(anio => {
      anio.secciones.forEach(seccion => {
        seccion.seccionDestinoId = null
        seccion.promocionarTodos = true
        seccion.estudiantes.forEach(estudiante => {
          estudiante.seleccionado = true
        })
      })
    })
  }

  return {
    // Estado
    aniosLectivos,
    anioOrigenId,
    anioDestinoId,
    showEstudiantesModal,
    seccionSeleccionada,
    
    // Computed
    anioOrigen,
    anioDestino,
    seccionesOrigen,
    seccionesDestino,
    aniosDisponiblesOrigen,
    aniosDisponiblesDestino,
    errores,
    puedePromocionar,
    
    // Métodos
    mostrarNotificacion,
    seleccionarAnioOrigen,
    seleccionarAnioDestino,
    seleccionarSeccionDestino,
    cambiarPromocionarTodos,
    abrirModalEstudiantes,
    cerrarModalEstudiantes,
    toggleEstudiante,
    seleccionarTodosEstudiantes,
    deseleccionarTodosEstudiantes,
    promocionarEstudiantes,
    estudiantesSeleccionados,
    nombreSeccionDestino,
    resetearFormulario
  }
}
