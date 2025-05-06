import { ref, computed, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBook,
  faBookOpen,
  faCalendar,
  faChevronDown,
  faChevronUp,
  faEdit,
  faExternalLinkAlt,
  faFilterCircleXmark,
  faFolderOpen,
  faPlusCircle,
  faPlus,
  faSave,
  faSearch,
  faTimes,
  faTrash,
  faUsers
} from '@fortawesome/free-solid-svg-icons'

// Agregar iconos a la biblioteca
library.add(
  faBook,
  faBookOpen,
  faCalendar,
  faChevronDown,
  faChevronUp,
  faEdit,
  faExternalLinkAlt,
  faFilterCircleXmark,
  faFolderOpen,
  faPlusCircle,
  faPlus,
  faSave,
  faSearch,
  faTimes,
  faTrash,
  faUsers
)

// Interfaces para los datos
export interface Grupo {
  id: number;
  nombre: string;
}

export interface Materia {
  id: number;
  nombre: string;
}


// Definición de tipos
export interface Material {
  id: number;
  titulo: string;
  descripcion: string;
  enlace: string;
  grupo: number;
  materia: number;
  fechaPublicacion: Date;
}

export interface FormularioMaterial {
  id: number | null;
  titulo: string;
  descripcion: string;
  enlace: string;
  grupo: number | string;
  materia: number | string;
  fechaPublicacion: Date | null;
}

export interface Errores {
  enlace?: string;
  [key: string]: string | undefined;
}

export function useMaterial() {
  // Datos simulados
  const grupos = ref<Grupo[]>([
    { id: 1, nombre: '1-A Primaria' },
    { id: 2, nombre: '2-A Primaria' },
    { id: 3, nombre: '3-A Primaria' },
    { id: 4, nombre: '4-A Primaria' },
    { id: 5, nombre: '5-A Primaria' },
    { id: 6, nombre: '6-A Primaria' }
  ])

  const materias = ref<Materia[]>([
    { id: 1, nombre: 'Matemáticas' },
    { id: 2, nombre: 'Español' },
    { id: 3, nombre: 'Ciencias' },
    { id: 4, nombre: 'Estudios Sociales' },
    { id: 5, nombre: 'Inglés' },
    { id: 6, nombre: 'Educación Física' }
  ])

  const materiales = ref<Material[]>([
    {
      id: 1,
      titulo: 'Guía de ejercicios de multiplicación',
      descripcion: 'Ejercicios prácticos para reforzar las tablas de multiplicar',
      enlace: 'https://ejemplo.com/guia-multiplicacion',
      grupo: 3,
      materia: 1,
      fechaPublicacion: new Date('2025-04-15')
    },
    {
      id: 2,
      titulo: 'Lectura comprensiva: El principito',
      descripcion: 'Actividades de comprensión de lectura basadas en El principito',
      enlace: 'https://ejemplo.com/lectura-principito',
      grupo: 4,
      materia: 2,
      fechaPublicacion: new Date('2025-04-20')
    },
    {
      id: 3,
      titulo: 'Video: El sistema solar',
      descripcion: '',
      enlace: 'https://ejemplo.com/video-sistema-solar',
      grupo: 5,
      materia: 3,
      fechaPublicacion: new Date('2025-04-25')
    }
  ])
  
  // Estado del formulario
  const formularioInicial: FormularioMaterial = {
    id: null,
    titulo: '',
    descripcion: '',
    enlace: '',
    grupo: '',
    materia: '',
    fechaPublicacion: null
  }

  const formulario = ref<FormularioMaterial>({ ...formularioInicial })
  const errores = ref<Errores>({})
  const editandoMaterial = ref(false)

  // Filtros
  const filtros = ref({
    busqueda: '',
    grupo: ''
  })

  // Computed properties
  const materialesFiltrados = computed(() => {
    return materiales.value.filter(material => {
      const coincideTitulo = material.titulo.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
      const coincideGrupo = !filtros.value.grupo || material.grupo === parseInt(filtros.value.grupo)
      return coincideTitulo && coincideGrupo
    })
  })

  const tieneFiltroBusqueda = computed(() => {
    return filtros.value.busqueda !== '' || filtros.value.grupo !== ''
  })

  // Métodos
  const validarFormulario = () => {
    const erroresTemp: Errores = {}
    
    // Validar URL
    if (formulario.value.enlace) {
      try {
        new URL(formulario.value.enlace)
      } catch {
        erroresTemp.enlace = 'Por favor, ingrese una URL válida'
      }
    }
    
    errores.value = erroresTemp
    return Object.keys(erroresTemp).length === 0
  }

  const guardarMaterial = () => {
    if (!validarFormulario()) return
    
    if (editandoMaterial.value) {
      // Actualizar material existente
      const index = materiales.value.findIndex(m => m.id === formulario.value.id)
      if (index !== -1) {
        // Convertir los tipos correctamente para el material actualizado
        const materialActualizado: Material = {
          id: formulario.value.id as number,
          titulo: formulario.value.titulo,
          descripcion: formulario.value.descripcion,
          enlace: formulario.value.enlace,
          grupo: Number(formulario.value.grupo),
          materia: Number(formulario.value.materia),
          fechaPublicacion: formulario.value.fechaPublicacion as Date
        }
        materiales.value[index] = materialActualizado
        alert('Material actualizado correctamente')
      }
    } else {
      // Agregar nuevo material
      const nuevoMaterial: Material = {
        id: materiales.value.length + 1,
        titulo: formulario.value.titulo,
        descripcion: formulario.value.descripcion,
        enlace: formulario.value.enlace,
        grupo: Number(formulario.value.grupo),
        materia: Number(formulario.value.materia),
        fechaPublicacion: new Date()
      }
      materiales.value.push(nuevoMaterial)
      alert('Material agregado correctamente')
    }
    
    // Reiniciar formulario
    resetearFormulario()
  }

  const editarMaterial = (material: Material) => {
    formulario.value = {
      id: material.id,
      titulo: material.titulo,
      descripcion: material.descripcion,
      enlace: material.enlace,
      grupo: material.grupo,
      materia: material.materia,
      fechaPublicacion: material.fechaPublicacion
    }
    editandoMaterial.value = true
  }

  const cancelarEdicion = () => {
    resetearFormulario()
  }

  const resetearFormulario = () => {
    formulario.value = { ...formularioInicial }
    errores.value = {}
    editandoMaterial.value = false
  }

  const confirmarEliminar = (material: Material) => {
    if (confirm(`¿Está seguro que desea eliminar el material "${material.titulo}"?`)) {
      eliminarMaterial(material.id)
    }
  }

  const eliminarMaterial = (id: number) => {
    const index = materiales.value.findIndex(m => m.id === id)
    if (index !== -1) {
      materiales.value.splice(index, 1)
      alert('Material eliminado correctamente')
    }
  }

  const limpiarFiltros = () => {
    filtros.value.busqueda = ''
    filtros.value.grupo = ''
  }

  const obtenerNombreGrupo = (id: number) => {
    const grupo = grupos.value.find(g => g.id === id)
    return grupo ? grupo.nombre : 'Grupo desconocido'
  }

  const obtenerNombreMateria = (id: number) => {
    const materia = materias.value.find(m => m.id === id)
    return materia ? materia.nombre : 'Materia desconocida'
  }

  const formatearFecha = (fecha: Date) => {
    if (!fecha) return ''
    return new Intl.DateTimeFormat('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(fecha)
  }

  // Estado de visibilidad de secciones
  const materialesVisible = ref(true)
  const formularioVisible = ref(true)

  // Toggle para mostrar/ocultar secciones
  const toggleMaterialesVisible = () => {
    materialesVisible.value = !materialesVisible.value
  }

  const toggleFormularioVisible = () => {
    formularioVisible.value = !formularioVisible.value
  }

  // Inicialización
  onMounted(() => {
    // Aquí se podrían cargar datos desde una API
  })
  
  return {
    // Datos
    grupos,
    materias,
    materiales,
    // Estado del formulario
    formulario,
    errores,
    editandoMaterial,
    // Filtros
    filtros,
    // Computed properties
    materialesFiltrados,
    tieneFiltroBusqueda,
    // Métodos
    validarFormulario,
    guardarMaterial,
    editarMaterial,
    cancelarEdicion,
    resetearFormulario,
    confirmarEliminar,
    eliminarMaterial,
    limpiarFiltros,
    obtenerNombreGrupo,
    obtenerNombreMateria,
    formatearFecha,
    // Estado de visibilidad
    materialesVisible,
    formularioVisible,
    toggleMaterialesVisible,
    toggleFormularioVisible
  }
}