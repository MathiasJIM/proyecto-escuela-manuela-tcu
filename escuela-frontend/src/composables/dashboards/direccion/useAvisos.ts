import { ref, computed, onMounted } from 'vue';

// Interfaces
interface Estudiante {
  id: number;
  nombre: string;
  seccion: string;
}

interface Aviso {
  id: number;
  titulo: string;
  cuerpo: string;
  destinatarios: 'profesores' | 'padres' | 'ambos' | 'especificos';
  estudiantesIds?: number[];
  medioEnvio: 'notificacion' | 'correo' | 'ambos';
  fechaEnvio: Date;
  fechaProgramada?: Date;
  estado: 'enviado' | 'programado';
  creadoPor: string;
}

interface AvisoForm {
  id?: number;
  titulo: string;
  cuerpo: string;
  destinatarios: string;
  estudiantesIds: number[];
  medioEnvio: string;
  programado: boolean;
  fechaProgramada: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  timeout?: number;
}

// Estado
const estudiantes = ref<Estudiante[]>([
  { id: 1, nombre: 'Ana García', seccion: '1-A' },
  { id: 2, nombre: 'Carlos Rodríguez', seccion: '1-A' },
  { id: 3, nombre: 'María López', seccion: '1-B' },
  { id: 4, nombre: 'Juan Pérez', seccion: '1-B' },
  { id: 5, nombre: 'Laura Martínez', seccion: '2-A' },
  { id: 6, nombre: 'Diego Sánchez', seccion: '2-A' },
  { id: 7, nombre: 'Sofía Hernández', seccion: '2-B' },
  { id: 8, nombre: 'Pablo González', seccion: '2-B' }
]);

const avisos = ref<Aviso[]>([
  { 
    id: 1, 
    titulo: 'Reunión de padres - Primer grado', 
    cuerpo: 'Se convoca a todos los padres de familia de primer grado a una reunión el día 15 de mayo a las 3:00 PM en el salón de actos.',
    destinatarios: 'padres',
    medioEnvio: 'ambos',
    fechaEnvio: new Date('2025-05-05'),
    estado: 'enviado',
    creadoPor: 'Director/a'
  },
  { 
    id: 2, 
    titulo: 'Entrega de calificaciones', 
    cuerpo: 'Se informa a los profesores que deben entregar las calificaciones del primer trimestre antes del 20 de mayo.',
    destinatarios: 'profesores',
    medioEnvio: 'notificacion',
    fechaEnvio: new Date('2025-05-10'),
    estado: 'enviado',
    creadoPor: 'Director/a'
  },
  { 
    id: 3, 
    titulo: 'Acto cívico - Día de la Independencia', 
    cuerpo: 'Se invita a toda la comunidad educativa al acto cívico por el Día de la Independencia que se realizará el 15 de septiembre a las 8:00 AM.',
    destinatarios: 'ambos',
    medioEnvio: 'ambos',
    fechaEnvio: new Date('2025-09-10'),
    fechaProgramada: new Date('2025-09-10'),
    estado: 'programado',
    creadoPor: 'Subdirector/a'
  },
  { 
    id: 4, 
    titulo: 'Taller de capacitación docente', 
    cuerpo: 'Se invita a todos los docentes al taller de capacitación sobre nuevas metodologías de enseñanza que se realizará el 25 de mayo de 9:00 AM a 12:00 PM.',
    destinatarios: 'profesores',
    medioEnvio: 'correo',
    fechaEnvio: new Date('2025-05-20'),
    fechaProgramada: new Date('2025-05-20'),
    estado: 'programado',
    creadoPor: 'Director/a'
  },
  { 
    id: 5, 
    titulo: 'Reunión específica - Estudiantes con necesidades especiales', 
    cuerpo: 'Se convoca a los padres de los estudiantes seleccionados a una reunión para discutir estrategias de apoyo el día 18 de mayo a las 4:00 PM.',
    destinatarios: 'especificos',
    estudiantesIds: [1, 5, 7],
    medioEnvio: 'correo',
    fechaEnvio: new Date('2025-05-15'),
    estado: 'enviado',
    creadoPor: 'Orientador/a'
  }
]);

const busqueda = ref('');
const filtroDestinatarios = ref('');
const filtroEstado = ref('');
const showModal = ref(false);
const showVerModal = ref(false);
const showConfirmModal = ref(false);
const modoEdicion = ref(false);
const busquedaEstudiantes = ref('');
const avisoForm = ref<AvisoForm>({
  titulo: '',
  cuerpo: '',
  destinatarios: '',
  estudiantesIds: [],
  medioEnvio: '',
  programado: false,
  fechaProgramada: ''
});
const avisoAEliminar = ref<Aviso | null>(null);
const avisoSeleccionado = ref<Aviso | null>(null);
const notification = ref<Notification>({
  show: false,
  message: '',
  type: 'info',
  icon: 'fa-info-circle',
  timeout: 3000
});

// Computed
const avisosFiltrados = computed(() => {
  let resultado = avisos.value;
  
  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(aviso => 
      aviso.titulo.toLowerCase().includes(termino)
    );
  }
  
  // Filtrar por destinatarios
  if (filtroDestinatarios.value) {
    resultado = resultado.filter(aviso => 
      aviso.destinatarios === filtroDestinatarios.value ||
      (filtroDestinatarios.value === 'ambos' && aviso.destinatarios === 'ambos')
    );
  }
  
  // Filtrar por estado
  if (filtroEstado.value) {
    resultado = resultado.filter(aviso => 
      aviso.estado === filtroEstado.value
    );
  }
  
  return resultado;
});

const estudiantesFiltrados = computed(() => {
  if (!busquedaEstudiantes.value) return [];
  
  const termino = busquedaEstudiantes.value.toLowerCase();
  return estudiantes.value.filter(estudiante => 
    estudiante.nombre.toLowerCase().includes(termino) &&
    !avisoForm.value.estudiantesIds.includes(estudiante.id)
  );
});

const esFormularioValido = computed(() => {
  const validacionBasica = 
    avisoForm.value.titulo.trim() !== '' &&
    avisoForm.value.cuerpo.trim() !== '' &&
    avisoForm.value.destinatarios !== '' &&
    avisoForm.value.medioEnvio !== '';
  
  // Si son destinatarios específicos, debe haber al menos uno seleccionado
  if (avisoForm.value.destinatarios === 'especificos') {
    return validacionBasica && avisoForm.value.estudiantesIds.length > 0;
  }
  
  // Si está programado, debe tener fecha
  if (avisoForm.value.programado) {
    return validacionBasica && avisoForm.value.fechaProgramada !== '';
  }
  
  return validacionBasica;
});

// Métodos
const abrirModalCrear = () => {
  modoEdicion.value = false;
  avisoForm.value = {
    titulo: '',
    cuerpo: '',
    destinatarios: '',
    estudiantesIds: [],
    medioEnvio: '',
    programado: false,
    fechaProgramada: ''
  };
  busquedaEstudiantes.value = '';
  showModal.value = true;
};

const editarAviso = (aviso: Aviso) => {
  if (aviso.estado === 'enviado') {
    showNotification('No se puede editar un aviso que ya ha sido enviado', 'error');
    return;
  }
  
  modoEdicion.value = true;
  avisoForm.value = {
    id: aviso.id,
    titulo: aviso.titulo,
    cuerpo: aviso.cuerpo,
    destinatarios: aviso.destinatarios,
    estudiantesIds: aviso.estudiantesIds || [],
    medioEnvio: aviso.medioEnvio,
    programado: !!aviso.fechaProgramada,
    fechaProgramada: aviso.fechaProgramada ? formatearFechaInput(aviso.fechaProgramada) : ''
  };
  busquedaEstudiantes.value = '';
  showModal.value = true;
};

const verAviso = (aviso: Aviso) => {
  avisoSeleccionado.value = aviso;
  showVerModal.value = true;
};

const cerrarModal = () => {
  showModal.value = false;
};

const cerrarModalVer = () => {
  avisoSeleccionado.value = null;
  showVerModal.value = false;
};

const guardarAviso = () => {
  if (!esFormularioValido.value) return;
  
  const fechaActual = new Date();
  let fechaEnvio = fechaActual;
  let estado: 'enviado' | 'programado' = 'enviado';
  
  if (avisoForm.value.programado && avisoForm.value.fechaProgramada) {
    fechaEnvio = new Date(avisoForm.value.fechaProgramada);
    estado = fechaEnvio > fechaActual ? 'programado' : 'enviado';
  }
  
  if (modoEdicion.value) {
    // Editar aviso existente
    const index = avisos.value.findIndex(a => a.id === avisoForm.value.id);
    if (index !== -1) {
      avisos.value[index] = {
        ...avisos.value[index],
        titulo: avisoForm.value.titulo,
        cuerpo: avisoForm.value.cuerpo,
        destinatarios: avisoForm.value.destinatarios as 'profesores' | 'padres' | 'ambos' | 'especificos',
        estudiantesIds: avisoForm.value.destinatarios === 'especificos' ? avisoForm.value.estudiantesIds : undefined,
        medioEnvio: avisoForm.value.medioEnvio as 'notificacion' | 'correo' | 'ambos',
        fechaEnvio: fechaEnvio,
        fechaProgramada: avisoForm.value.programado ? fechaEnvio : undefined,
        estado: estado
      };
      showNotification('Aviso actualizado correctamente', 'success');
    }
  } else {
    // Crear nuevo aviso
    const newId = Math.max(0, ...avisos.value.map(a => a.id)) + 1;
    avisos.value.push({
      id: newId,
      titulo: avisoForm.value.titulo,
      cuerpo: avisoForm.value.cuerpo,
      destinatarios: avisoForm.value.destinatarios as 'profesores' | 'padres' | 'ambos' | 'especificos',
      estudiantesIds: avisoForm.value.destinatarios === 'especificos' ? avisoForm.value.estudiantesIds : undefined,
      medioEnvio: avisoForm.value.medioEnvio as 'notificacion' | 'correo' | 'ambos',
      fechaEnvio: fechaEnvio,
      fechaProgramada: avisoForm.value.programado ? fechaEnvio : undefined,
      estado: estado,
      creadoPor: 'Director/a' // En producción, esto vendría del usuario actual
    });
    showNotification('Aviso creado correctamente', 'success');
  }
  
  cerrarModal();
};

const confirmarEliminar = (aviso: Aviso) => {
  avisoAEliminar.value = aviso;
  showConfirmModal.value = true;
};

const cancelarEliminar = () => {
  avisoAEliminar.value = null;
  showConfirmModal.value = false;
};

const eliminarAviso = () => {
  if (!avisoAEliminar.value) return;
  
  const index = avisos.value.findIndex(a => a.id === avisoAEliminar.value?.id);
  if (index !== -1) {
    avisos.value.splice(index, 1);
    showNotification('Aviso eliminado correctamente', 'success');
  }
  
  cancelarEliminar();
};

const seleccionarEstudiante = (estudiante: Estudiante) => {
  if (!avisoForm.value.estudiantesIds.includes(estudiante.id)) {
    avisoForm.value.estudiantesIds.push(estudiante.id);
  }
  busquedaEstudiantes.value = '';
};

const eliminarEstudiante = (id: number) => {
  avisoForm.value.estudiantesIds = avisoForm.value.estudiantesIds.filter(e => e !== id);
};

const obtenerNombreEstudiante = (id: number): string => {
  const estudiante = estudiantes.value.find(e => e.id === id);
  return estudiante ? `${estudiante.nombre} (${estudiante.seccion})` : '';
};

const obtenerDestinatarios = (aviso: Aviso | null): string => {
  if (!aviso) return '';
  
  switch (aviso.destinatarios) {
    case 'profesores':
      return 'Todos los profesores';
    case 'padres':
      return 'Todos los padres';
    case 'ambos':
      return 'Profesores y padres';
    case 'especificos':
      return `Padres específicos (${aviso.estudiantesIds?.length || 0} estudiantes)`;
    default:
      return '';
  }
};

const obtenerMedioEnvio = (aviso: Aviso | null): string => {
  if (!aviso) return '';
  
  switch (aviso.medioEnvio) {
    case 'notificacion':
      return 'Notificación interna';
    case 'correo':
      return 'Correo electrónico';
    case 'ambos':
      return 'Notificación y correo';
    default:
      return '';
  }
};

const formatearFecha = (fecha?: Date): string => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatearFechaInput = (fecha: Date): string => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  notification.value = {
    show: true,
    message,
    type,
    icon: iconMap[type],
    timeout: 3000
  };
  
  // Auto-close after timeout
  setTimeout(() => {
    closeNotification();
  }, notification.value.timeout);
};

const closeNotification = () => {
  notification.value.show = false;
};

// Cargar datos iniciales
onMounted(() => {
  // En producción, aquí se cargarían los datos desde la API
});

export default function useAvisos() {
  return {
    // Estado
    estudiantes,
    avisos,
    busqueda,
    filtroDestinatarios,
    filtroEstado,
    showModal,
    showVerModal,
    showConfirmModal,
    modoEdicion,
    busquedaEstudiantes,
    avisoForm,
    avisoAEliminar,
    avisoSeleccionado,
    notification,
    
    // Computed
    avisosFiltrados,
    estudiantesFiltrados,
    esFormularioValido,
    
    // Métodos
    abrirModalCrear,
    editarAviso,
    verAviso,
    cerrarModal,
    cerrarModalVer,
    guardarAviso,
    confirmarEliminar,
    cancelarEliminar,
    eliminarAviso,
    seleccionarEstudiante,
    eliminarEstudiante,
    obtenerNombreEstudiante,
    obtenerDestinatarios,
    obtenerMedioEnvio,
    formatearFecha,
    formatearFechaInput,
    showNotification,
    closeNotification
  };
}