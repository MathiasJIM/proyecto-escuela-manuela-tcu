import { ref, reactive, computed, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlus, 
  faEye, 
  faPen, 
  faTrashAlt, 
  faXmark, 
  faSearch, 
  faTimes, 
  faUserTie, 
  faEnvelope, 
  faBook, 
  faUsers 
} from '@fortawesome/free-solid-svg-icons'
import ProfesoresService from '@/services/profesores.service'
import type { 
  Profesor as ProfesorAPI, 
  Materia as MateriaAPI, 
  Seccion as SeccionAPI,
  ProfesorMateriasAsignacion,
  ProfesorSeccionesAsignacion,
  ProfesorCompleto
} from '@/services/profesores.service'
import MateriasService from '@/services/materias.service'
import SeccionesService from '@/services/secciones.service'
import AniosLectivosService, { type AnioLectivo } from '@/services/anios-lectivos.service'

// Registrar los iconos
library.add(
  faPlus,
  faEye,
  faPen,
  faTrashAlt,
  faXmark,
  faSearch,
  faTimes,
  faUserTie,
  faEnvelope,
  faBook,
  faUsers
)

// Definición de interfaces
interface Materia {
  id_materia: string
  nombre: string
  anio_nombre?: string
}

interface Seccion {
  id_seccion: string
  nombre: string
  grado: string
  anio_nombre?: string
}

interface Profesor {
  id_profesor: string
  nombreCompleto: string
  email: string
  materias: Materia[]
  secciones: Seccion[]
}

interface FormData {
  id_profesor: string
  nombreCompleto: string
  email: string
  materias: Materia[]
  secciones: Seccion[]
}

export default function useGestionProfes() {
  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    // Crear un elemento de notificación
    const notificacion = document.createElement('div')
    notificacion.className = `notificacion notificacion-${tipo}`
    notificacion.innerHTML = `
      <div class="notificacion-contenido">
        <span>${mensaje}</span>
        <button class="notificacion-cerrar">&times;</button>
      </div>
    `
    
    // Estilos para la notificación
    notificacion.style.position = 'fixed'
    notificacion.style.top = '20px'
    notificacion.style.right = '20px'
    notificacion.style.backgroundColor = tipo === 'success' ? '#4CAF50' : '#f44336'
    notificacion.style.color = 'white'
    notificacion.style.padding = '15px'
    notificacion.style.borderRadius = '4px'
    notificacion.style.zIndex = '1000'
    notificacion.style.minWidth = '300px'
    notificacion.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
    
    // Agregar al DOM
    document.body.appendChild(notificacion)
    
    // Botón para cerrar
    const cerrarBtn = notificacion.querySelector('.notificacion-cerrar')
    if (cerrarBtn) {
      cerrarBtn.addEventListener('click', () => {
        document.body.removeChild(notificacion)
      })
    }
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion)
      }
    }, 5000)
  }

  // Estado para la lista de profesores
  const profesores = ref<Profesor[]>([])
  const cargando = ref(false)
  const error = ref('')

  // Estado para los años lectivos
  const aniosLectivos = ref<AnioLectivo[]>([])
  const anioLectivoActual = ref('')

  // Datos para el formulario
  const formData = reactive<FormData>({
    id_profesor: '',
    nombreCompleto: '',
    email: '',
    materias: [],
    secciones: []
  })

  // Estado para el modal
  const showModal = ref(false)
  const isEditing = ref(false)

  // Estado para el diálogo de confirmación
  const showConfirmDialog = ref(false)
  const profesorAEliminar = ref<Profesor | null>(null)

  // Estado para el modal de detalles
  const showDetailsModal = ref(false)
  const selectedProfesor = ref<Profesor | null>(null)

  // Estado para la búsqueda
  const searchTerm = ref('')

  // Datos para los selects
  const materiasDisponibles = ref<Materia[]>([])
  const seccionesDisponibles = ref<Seccion[]>([])
  
  // Cargar datos iniciales
  const cargarDatos = async () => {
    cargando.value = true
    error.value = ''
    
    try {
      // Cargar años lectivos
      aniosLectivos.value = await AniosLectivosService.obtenerAniosLectivos()
      if (aniosLectivos.value.length > 0) {
        // Buscar el año activo o usar el primero
        const anioActivo = aniosLectivos.value.find(a => a.activo) || aniosLectivos.value[0]
        anioLectivoActual.value = anioActivo.id_anio
      }
      
      // Cargar profesores
      await cargarProfesores()
      
      // Cargar materias
      const materias = await MateriasService.obtenerMaterias()
      materiasDisponibles.value = materias.map(m => ({
        id_materia: m.id_materia,
        nombre: m.nombre
      }))
      
      // Cargar secciones
      const secciones = await SeccionesService.obtenerSecciones()
      seccionesDisponibles.value = secciones.map(s => ({
        id_seccion: s.id_seccion,
        nombre: s.nombre,
        grado: s.grado
      }))
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err)
      error.value = 'Error al cargar datos. Por favor, intente de nuevo.'
    } finally {
      cargando.value = false
    }
  }
  
  // Cargar profesores
  const cargarProfesores = async () => {
    try {
      const profesoresAPI = await ProfesoresService.obtenerProfesores()
      profesores.value = profesoresAPI.map(p => ({
        id_profesor: p.id_profesor,
        nombreCompleto: p.nombre,
        email: p.correo,
        materias: [],
        secciones: []
      }))
      
      // Cargar detalles de cada profesor
      for (const profesor of profesores.value) {
        try {
          const materias = await ProfesoresService.obtenerMateriasProfesor(profesor.id_profesor)
          const secciones = await ProfesoresService.obtenerSeccionesProfesor(profesor.id_profesor)
          
          profesor.materias = materias
          profesor.secciones = secciones
        } catch (err) {
          console.error(`Error al cargar detalles del profesor ${profesor.nombreCompleto}:`, err)
        }
      }
    } catch (err) {
      console.error('Error al cargar profesores:', err)
      error.value = 'Error al cargar profesores. Por favor, intente de nuevo.'
    }
  }

  // Variables temporales para los selects múltiples
  const selectedMateria = ref<Materia | null>(null)
  const selectedSeccion = ref<Seccion | null>(null)

  // Filtrar profesores según el término de búsqueda
  const filteredProfesores = computed(() => {
    if (!searchTerm.value) return profesores.value
    
    const term = searchTerm.value.toLowerCase()
    return profesores.value.filter(profesor => 
      profesor.nombreCompleto.toLowerCase().includes(term) ||
      profesor.email.toLowerCase().includes(term)
    )
  })

  // Funciones para formatear datos en la tabla
  const formatMaterias = (materias: Materia[]) => {
    if (!materias || materias.length === 0) return 'Ninguna'
    if (materias.length <= 2) {
      return materias.map(m => m.nombre).join(', ')
    }
    return `${materias[0].nombre}, ${materias[1].nombre}...`
  }

  const formatSecciones = (secciones: Seccion[]) => {
    if (!secciones || secciones.length === 0) return 'Ninguna'
    return secciones.map(s => s.nombre).join(', ')
  }

  // Funciones para manejar el modal
  const openModal = (profesor: Profesor | null) => {
    if (profesor) {
      // Modo edición
      isEditing.value = true
      formData.id_profesor = profesor.id_profesor
      formData.nombreCompleto = profesor.nombreCompleto
      formData.email = profesor.email
      formData.materias = [...profesor.materias]
      formData.secciones = [...profesor.secciones]
    } else {
      // Modo creación
      isEditing.value = false
      formData.id_profesor = ''
      formData.nombreCompleto = ''
      formData.email = ''
      formData.materias = []
      formData.secciones = []
    }
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    selectedMateria.value = null
    selectedSeccion.value = null
  }

  // Funciones para manejar materias y secciones
  const agregarMateria = () => {
    if (selectedMateria.value) {
      const materia = selectedMateria.value 
      // Verificar que no esté ya agregada
      if (!formData.materias.some(m => m.id_materia === materia.id_materia)) {
        formData.materias.push(materia)
      }
      selectedMateria.value = null
    }
  }

  const eliminarMateria = (index: number) => {
    formData.materias.splice(index, 1)
  }

  const agregarSeccion = () => {
    if (selectedSeccion.value) {
      const seccion = selectedSeccion.value 
      // Verificar que no esté ya agregada
      if (!formData.secciones.some(s => s.id_seccion === seccion.id_seccion)) {
        formData.secciones.push(seccion)
      }
      selectedSeccion.value = null
    }
  }

  const eliminarSeccion = (index: number) => {
    formData.secciones.splice(index, 1)
  }

  // Funciones para guardar el profesor
  const guardarProfesor = async () => {
    cargando.value = true
    error.value = ''

    // Validar formulario
    if (!formData.nombreCompleto || !formData.email) {
      error.value = 'Por favor, complete todos los campos requeridos.'
      cargando.value = false
      return
    }

    try {
      if (isEditing.value) {
        // Actualizar profesor existente usando el endpoint
        await ProfesoresService.actualizarProfesor(formData.id_profesor, {
          nombre: formData.nombreCompleto,
          correo: formData.email
        })
        
        // Asignar materias y secciones
        if (formData.materias.length > 0) {
          const materiasAsignacion: ProfesorMateriasAsignacion = {
            id_profesor: formData.id_profesor,
            id_materias: formData.materias.map(m => m.id_materia),
            id_anio: anioLectivoActual.value
          }
          await ProfesoresService.asignarMaterias(materiasAsignacion)
        }
        
        if (formData.secciones.length > 0) {
          const seccionesAsignacion: ProfesorSeccionesAsignacion = {
            id_profesor: formData.id_profesor,
            id_secciones: formData.secciones.map(s => s.id_seccion)
          }
          await ProfesoresService.asignarSecciones(seccionesAsignacion)
        }
        
        // Actualizar la lista de profesores
        await cargarProfesores()
        
        // Cerrar modal y limpiar formulario
        closeModal()
      } else {
        // Crear nuevo profesor usando el endpoint
        const nuevoProfesor = await ProfesoresService.crearProfesor({
          nombre: formData.nombreCompleto,
          correo: formData.email
        })
        
        // Asignar materias y secciones si hay
        if (formData.materias.length > 0) {
          const materiasAsignacion: ProfesorMateriasAsignacion = {
            id_profesor: nuevoProfesor.id_profesor,
            id_materias: formData.materias.map(m => m.id_materia),
            id_anio: anioLectivoActual.value
          }
          await ProfesoresService.asignarMaterias(materiasAsignacion)
        }
        
        if (formData.secciones.length > 0) {
          const seccionesAsignacion: ProfesorSeccionesAsignacion = {
            id_profesor: nuevoProfesor.id_profesor,
            id_secciones: formData.secciones.map(s => s.id_seccion)
          }
          await ProfesoresService.asignarSecciones(seccionesAsignacion)
        }
        
        // Actualizar la lista de profesores
        await cargarProfesores()
        
        // Cerrar modal y limpiar formulario
        closeModal()
        
        // Mostrar mensaje de éxito
        mostrarNotificacion('Profesor creado correctamente. Se ha enviado un correo con las credenciales.', 'success')
      }
    } catch (err) {
      console.error('Error al guardar profesor:', err)
      error.value = 'Error al guardar profesor. Por favor, intente de nuevo.'
    } finally {
      cargando.value = false
    }
  }
  
  // Funciones para manejar el diálogo de confirmación
  const openConfirmDialog = (profesor: Profesor) => {
    profesorAEliminar.value = profesor
    showConfirmDialog.value = true
  }

  const closeConfirmDialog = () => {
    showConfirmDialog.value = false
    profesorAEliminar.value = null
  }

  const eliminarProfesor = async () => {
    if (profesorAEliminar.value) {
      cargando.value = true
      error.value = ''

      try {
        // Llamar al endpoint para eliminar el profesor
        await ProfesoresService.eliminarProfesor(profesorAEliminar.value.id_profesor)
        
        // Actualizar la lista de profesores
        profesores.value = profesores.value.filter(p => p.id_profesor !== profesorAEliminar.value?.id_profesor)
        closeConfirmDialog()
      } catch (err) {
        console.error('Error al eliminar profesor:', err)
        error.value = 'Error al eliminar profesor. Por favor, intente de nuevo.'
      } finally {
        cargando.value = false
      }
    }
  }

  // Funciones para manejar el modal de detalles
  const openDetailsModal = async (profesor: Profesor) => {
    cargando.value = true
    error.value = ''
    
    try {
      // Obtener detalles completos del profesor
      const detallesProfesor = await ProfesoresService.obtenerProfesor(profesor.id_profesor)
      const materias = await ProfesoresService.obtenerMateriasProfesor(profesor.id_profesor)
      const secciones = await ProfesoresService.obtenerSeccionesProfesor(profesor.id_profesor)
      
      selectedProfesor.value = {
        id_profesor: detallesProfesor.profesor.id_profesor,
        nombreCompleto: detallesProfesor.profesor.nombre,
        email: detallesProfesor.profesor.correo,
        materias,
        secciones
      }
      
      showDetailsModal.value = true
    } catch (err) {
      console.error('Error al obtener detalles del profesor:', err)
      error.value = 'Error al obtener detalles del profesor. Por favor, intente de nuevo.'
    } finally {
      cargando.value = false
    }
  }

  const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedProfesor.value = null
  }

  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatos()
  })

  // Funciones para ver y eliminar profesor
  const verDetalles = (profesor: Profesor) => {
    openDetailsModal(profesor)
  }

  const editarDesdeDetalles = () => {
    if (selectedProfesor.value) {
      openModal(selectedProfesor.value)
      closeDetailsModal()
    }
  }

  const confirmarEliminar = (profesor: Profesor) => {
    profesorAEliminar.value = profesor
    showConfirmDialog.value = true
  }

  return {
    // Estado
    profesores,
    cargando,
    error,
    showModal,
    isEditing,
    formData,
    showConfirmDialog,
    profesorAEliminar,
    showDetailsModal,
    selectedProfesor,
    searchTerm,
    materiasDisponibles,
    seccionesDisponibles,
    aniosLectivos,
    anioLectivoActual,
    filteredProfesores,
    
    // Datos para los selects
    selectedMateria,
    selectedSeccion,
    
    // Funciones para formatear datos
    formatMaterias,
    formatSecciones,
    
    // Funciones para el modal
    openModal,
    closeModal,
    
    // Funciones para materias y secciones
    agregarMateria,
    eliminarMateria,
    agregarSeccion,
    eliminarSeccion,
    
    // Funciones para el formulario
    guardarProfesor,
    
    // Funciones para ver y eliminar
    verDetalles,
    editarDesdeDetalles,
    openDetailsModal,
    closeDetailsModal,
    confirmarEliminar,
    eliminarProfesor,
    closeConfirmDialog,
    
    // Funciones para cargar datos
    cargarDatos,
    cargarProfesores
  }
}