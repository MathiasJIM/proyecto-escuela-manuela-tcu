<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Avisos</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear Aviso
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-group">
        <div class="search-container">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar por título..."
            class="search-input"
          />
          <font-awesome-icon icon="fa-search" class="search-icon" />
        </div>

        <div class="filter-select-container">
          <label for="destinatariosFilter" class="filter-label">Destinatarios:</label>
          <select 
            id="destinatariosFilter" 
            v-model="filtroDestinatarios" 
            class="filter-select"
          >
            <option value="">Todos</option>
            <option value="profesores">Profesores</option>
            <option value="padres">Padres</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>

        <div class="filter-select-container">
          <label for="estadoFilter" class="filter-label">Estado:</label>
          <select 
            id="estadoFilter" 
            v-model="filtroEstado" 
            class="filter-select"
          >
            <option value="">Todos</option>
            <option value="enviado">Enviado</option>
            <option value="programado">Programado</option>
          </select>
        </div>
      </div>
      <div class="filter-info">
        <span>{{ avisosFiltrados.length }} avisos encontrados</span>
      </div>
    </div>

    <!-- Tabla de avisos -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-titulo">Título</th>
            <th class="col-fecha">Fecha de envío</th>
            <th class="col-destinatarios">Destinatarios</th>
            <th class="col-medio">Medio de envío</th>
            <th class="col-estado">Estado</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="avisosFiltrados.length === 0">
            <td colspan="6" class="empty-message">
              No se encontraron avisos. Crea un nuevo aviso para comenzar.
            </td>
          </tr>
          <tr v-for="aviso in avisosFiltrados" :key="aviso.id">
            <td class="aviso-titulo">{{ aviso.titulo }}</td>
            <td>{{ formatearFecha(aviso.fechaEnvio) }}</td>
            <td>{{ obtenerDestinatarios(aviso) }}</td>
            <td>{{ obtenerMedioEnvio(aviso) }}</td>
            <td>
              <span class="estado-badge" :class="aviso.estado">
                {{ aviso.estado === 'enviado' ? 'Enviado' : 'Programado' }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button 
                  @click="verAviso(aviso)" 
                  class="btn-accion btn-ver"
                  title="Ver detalles"
                >
                  <font-awesome-icon :icon="['fas', 'eye']" />
                </button>
                <button 
                  v-if="aviso.estado === 'programado'"
                  @click="editarAviso(aviso)" 
                  class="btn-accion btn-editar"
                  title="Editar"
                >
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button 
                  @click="confirmarEliminar(aviso)" 
                  class="btn-accion btn-eliminar"
                  title="Eliminar"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar aviso -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicion ? 'Editar aviso' : 'Crear nuevo aviso' }}</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="guardarAviso">
            <div class="form-group">
              <label for="tituloAviso" class="form-label">Título del aviso:</label>
              <input
                type="text"
                id="tituloAviso"
                v-model="avisoForm.titulo"
                class="form-control"
                required
                placeholder="Ej: Reunión de padres"
              />
            </div>
            
            <div class="form-group">
              <label for="cuerpoAviso" class="form-label">Cuerpo del aviso:</label>
              <textarea
                id="cuerpoAviso"
                v-model="avisoForm.cuerpo"
                class="form-control"
                rows="5"
                required
                placeholder="Escriba el contenido del aviso aquí..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="destinatariosAviso" class="form-label">Destinatarios:</label>
              <select
                id="destinatariosAviso"
                v-model="avisoForm.destinatarios"
                class="form-control"
                required
              >
                <option value="">Seleccione los destinatarios</option>
                <option value="profesores">Todos los profesores</option>
                <option value="padres">Todos los padres</option>
                <option value="ambos">Todos los profesores y padres</option>
                <option value="especificos">Padres de estudiantes específicos</option>
              </select>
            </div>
            
            <div class="form-group" v-if="avisoForm.destinatarios === 'especificos'">
              <label for="estudiantesEspecificos" class="form-label">Buscar estudiantes:</label>
              <div class="search-estudiantes-container">
                <input
                  type="text"
                  id="estudiantesEspecificos"
                  v-model="busquedaEstudiantes"
                  class="form-control"
                  placeholder="Escriba el nombre del estudiante..."
                />
                <div class="estudiantes-list" v-if="busquedaEstudiantes && estudiantesFiltrados.length > 0">
                  <div 
                    v-for="estudiante in estudiantesFiltrados" 
                    :key="estudiante.id"
                    class="estudiante-item"
                    @click="seleccionarEstudiante(estudiante)"
                  >
                    {{ estudiante.nombre }} - {{ estudiante.seccion }}
                  </div>
                </div>
              </div>
              
              <div class="estudiantes-seleccionados" v-if="avisoForm.estudiantesIds.length > 0">
                <div 
                  v-for="id in avisoForm.estudiantesIds" 
                  :key="id"
                  class="estudiante-tag"
                >
                  {{ obtenerNombreEstudiante(id) }}
                  <button 
                    type="button" 
                    class="estudiante-remove" 
                    @click="eliminarEstudiante(id)"
                  >
                    <font-awesome-icon icon="fa-times" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="medioEnvioAviso" class="form-label">Medio de envío:</label>
              <select
                id="medioEnvioAviso"
                v-model="avisoForm.medioEnvio"
                class="form-control"
                required
              >
                <option value="">Seleccione el medio de envío</option>
                <option value="notificacion">Notificación interna</option>
                <option value="correo">Correo electrónico</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <input 
                  type="checkbox" 
                  v-model="avisoForm.programado"
                /> 
                Programar envío
              </label>
              
              <div v-if="avisoForm.programado" class="fecha-programacion">
                <input
                  type="datetime-local"
                  v-model="avisoForm.fechaProgramada"
                  class="form-control"
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button 
            class="btn btn-primary" 
            @click="guardarAviso" 
            :disabled="!esFormularioValido"
          >
            {{ modoEdicion ? 'Guardar cambios' : 'Crear aviso' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para ver aviso -->
    <div class="modal-overlay" v-if="showVerModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ avisoSeleccionado?.titulo }}</h2>
          <button class="modal-close-btn" @click="cerrarModalVer">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <div class="aviso-detalles">
            <div class="aviso-meta">
              <p><strong>Fecha de envío:</strong> {{ formatearFecha(avisoSeleccionado?.fechaEnvio) }}</p>
              <p><strong>Destinatarios:</strong> {{ obtenerDestinatarios(avisoSeleccionado) }}</p>
              <p><strong>Medio de envío:</strong> {{ obtenerMedioEnvio(avisoSeleccionado) }}</p>
              <p><strong>Estado:</strong> {{ avisoSeleccionado?.estado === 'enviado' ? 'Enviado' : 'Programado' }}</p>
            </div>
            <div class="aviso-cuerpo">
              <p>{{ avisoSeleccionado?.cuerpo }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="cerrarModalVer">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div class="modal-overlay" v-if="showConfirmModal">
      <div class="modal-container confirm-modal">
        <div class="modal-header">
          <h2 class="modal-title">Confirmar eliminación</h2>
          <button class="modal-close-btn" @click="cancelarEliminar">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <p class="confirm-message">
            ¿Está seguro que desea eliminar el aviso <strong>{{ avisoAEliminar?.titulo }}</strong>?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEliminar">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="eliminarAviso">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación -->
    <div class="notification" v-if="notification.show" :class="notification.type">
      <div class="notification-content">
        <font-awesome-icon :icon="notification.icon" class="notification-icon" />
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button class="notification-close" @click="closeNotification">
        <font-awesome-icon icon="fa-xmark" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
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
</script>

<style scoped>
/* Estilos generales */
.container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* Filtros y acciones */
.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-select-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background-color: white;
  min-width: 150px;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  padding-left: 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #182645;
  box-shadow: 0 0 0 3px rgba(24, 38, 69, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.filter-info {
  font-size: 14px;
  color: #6b7280;
}

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  gap: 8px;
}

.btn-primary {
  background-color: #182645;
  color: white;
}

.btn-primary:hover {
  background-color: #111827;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tabla de avisos */
.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 32px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table th {
  padding: 12px 16px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  background-color: #f9fafb;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.col-titulo {
  width: 25%;
}

.col-fecha {
  width: 15%;
}

.col-destinatarios {
  width: 15%;
}

.col-medio {
  width: 15%;
}

.col-estado {
  width: 10%;
}

.col-acciones {
  width: 20%;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
}

.aviso-titulo {
  font-weight: 500;
  text-align: left;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #f9fafb;
}

.empty-message {
  text-align: center;
  padding: 32px;
  color: #6b7280;
  font-style: italic;
}

/* Estado badge */
.estado-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.estado-badge.enviado {
  background-color: #d1fae5;
  color: #065f46;
}

.estado-badge.programado {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Acciones */
.acciones {
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
}

.btn-accion {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-ver {
  background-color: #eff6ff;
  color: #3b82f6;
}

.btn-editar {
  background-color: #ecfdf5;
  color: #10b981;
}

.btn-eliminar {
  background-color: #fef2f2;
  color: #ef4444;
}

.btn-accion:hover {
  opacity: 0.9;
}

.btn-ver:hover {
  color: #2563eb;
}

.btn-editar:hover {
  color: #059669;
}

.btn-eliminar:hover {
  color: #dc2626;
}

.btn-accion svg {
  font-size: 14px;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #111827;
}

.modal-content {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

/* Formulario */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background-color: white;
}

.form-control:focus {
  outline: none;
  border-color: #182645;
  box-shadow: 0 0 0 3px rgba(24, 38, 69, 0.1);
}

.fecha-programacion {
  margin-top: 12px;
}

/* Búsqueda de estudiantes */
.search-estudiantes-container {
  position: relative;
}

.estudiantes-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.estudiante-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.estudiante-item:hover {
  background-color: #f3f4f6;
}

.estudiantes-seleccionados {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.estudiante-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
  font-size: 12px;
}

.estudiante-remove {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* Detalles del aviso */
.aviso-detalles {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.aviso-meta {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 6px;
}

.aviso-meta p {
  margin: 8px 0;
}

.aviso-cuerpo {
  white-space: pre-line;
  line-height: 1.6;
}

/* Modal de confirmación */
.confirm-modal {
  max-width: 450px;
}

.confirm-message {
  font-size: 15px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

/* Notificaciones */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  z-index: 2000;
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  font-size: 18px;
}

.notification-message {
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  margin-left: 12px;
  font-size: 14px;
}

.notification-close:hover {
  opacity: 1;
}

.notification.success {
  background-color: #ecfdf5;
  color: #065f46;
  border-left: 4px solid #10b981;
}

.notification.error {
  background-color: #fef2f2;
  color: #b91c1c;
  border-left: 4px solid #ef4444;
}

.notification.warning {
  background-color: #fffbeb;
  color: #92400e;
  border-left: 4px solid #f59e0b;
}

.notification.info {
  background-color: #eff6ff;
  color: #1e40af;
  border-left: 4px solid #3b82f6;
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    width: 100%;
  }
  
  .filter-info {
    display: none;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select-container {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .actions {
    flex-direction: column;
    gap: 4px;
    width: 100%;
    max-width: 150px;
    margin: 0 auto;
  }
  
  .btn-action {
    width: 100%;
    justify-content: center;
  }
  
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
}
</style>
