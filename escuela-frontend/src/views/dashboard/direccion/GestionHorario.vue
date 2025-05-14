<template>
  <div class="container">
    <!-- 1. Encabezado y filtros -->
    <header class="header">
      <h1 class="title">Gestion de Horarios</h1>
    </header>

    <div class="filters-container">
      <div class="filter-group">
        <label class="filter-label">Año Lectivo:</label>
        <select v-model="selectedAnioLectivo" class="filter-select">
          <option value="">Seleccionar año lectivo</option>
          <option v-for="anio in aniosLectivos" :key="anio.id" :value="anio.id">
            {{ anio.nombre }}
          </option>
        </select>

        <label class="filter-label">Sección:</label>
        <select v-model="selectedSeccion" class="filter-select" :disabled="!selectedAnioLectivo">
          <option value="">Seleccionar sección</option>
          <option v-for="seccion in secciones" :key="seccion.id" :value="seccion.id">
            {{ seccion.nombre }}
          </option>
        </select>

        <button 
          class="btn btn-primary" 
          @click="cargarHorario" 
          :disabled="!selectedAnioLectivo || !selectedSeccion"
        >
          <font-awesome-icon icon="fa-search" />
          Cargar Horario
        </button>
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary" @click="limpiarHorario" :disabled="!horarioCargado">
          <font-awesome-icon icon="fa-times" />
          Limpiar Horario
        </button>
        <button class="btn btn-primary" @click="guardarHorario" :disabled="!horarioCargado">
          <font-awesome-icon icon="fa-check" />
          Guardar Horario
        </button>
      </div>
    </div>

    <!-- 2. Tabla editable tipo cuadrícula -->
    <div class="schedule-container" v-if="horarioCargado">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="time-header">Hora</th>
            <th class="day-header" v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bloque, index) in bloques" :key="index">
            <td class="time-cell">{{ bloque.horaInicio }} - {{ bloque.horaFin }}</td>
            <td 
              v-for="dia in diasSemana" 
              :key="`${bloque.id}-${dia}`" 
              @click="abrirModalAsignacion(bloque, dia)"
              :class="[
                'schedule-cell',
                { 'has-conflict': tieneConflicto(bloque, dia) },
                getCellClass(bloque, dia)
              ]"
            >
              <div v-if="getAsignacion(bloque, dia)" class="schedule-slot">
                <div class="schedule-slot-subject">
                  {{ getAsignacion(bloque, dia)?.materia?.nombre || 'Sin materia' }}
                </div>
                <div class="schedule-slot-teacher">
                  {{ getAsignacion(bloque, dia)?.profesor?.nombre || 'Sin profesor' }}
                </div>
                <div v-if="tieneConflicto(bloque, dia)" class="conflict-indicator">
                  <font-awesome-icon icon="fa-exclamation-triangle" />
                </div>
              </div>
              <div v-else class="empty-slot">
                <font-awesome-icon icon="fa-plus" class="empty-slot-icon" />
                <span class="empty-slot-text">Asignar</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-state-content">
        <font-awesome-icon icon="fa-clock" class="empty-state-icon" />
        <h3 class="empty-state-title">No hay horario cargado</h3>
        <p class="empty-state-message">
          Selecciona un año lectivo y una sección para comenzar a crear el horario.
        </p>
      </div>
    </div>

    <!-- Notificación personalizada -->
    <div class="notification" v-if="notification.show" :class="notification.type">
      <div class="notification-content">
        <font-awesome-icon :icon="notification.icon" class="notification-icon" />
        <span class="notification-message">{{ notification.message }}</span>
      </div>
      <button class="notification-close" @click="closeNotification">
        <font-awesome-icon icon="fa-xmark" />
      </button>
    </div>

    <!-- Modal de confirmación -->
    <div class="modal" v-if="confirmModal.show">
      <div class="modal-backdrop" @click="cancelConfirmation"></div>
      <div class="modal-container confirm-modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ confirmModal.title }}</h2>
          <button class="modal-close-btn" @click="cancelConfirmation">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <p class="confirm-message">{{ confirmModal.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelConfirmation">
            Cancelar
          </button>
          <button 
            class="btn" 
            :class="confirmModal.type === 'danger' ? 'btn-danger' : 'btn-primary'" 
            @click="confirmAction"
          >
            {{ confirmModal.confirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- 3. Modal de asignación -->
    <div class="modal" v-if="showModal">
      <div class="modal-backdrop" @click="cerrarModal"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Asignar Clase</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <div class="modal-info">
            <p class="modal-info-text">
              <strong>Día:</strong> {{ modalData.dia }}
            </p>
            <p class="modal-info-text">
              <strong>Horario:</strong> {{ modalData.bloque?.horaInicio }} - {{ modalData.bloque?.horaFin }}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Materia:</label>
            <select v-model="modalData.materiaId" class="form-select">
              <option value="">Seleccionar materia</option>
              <option v-for="materia in materias" :key="materia.id" :value="materia.id">
                {{ materia.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Profesor:</label>
            <select 
              v-model="modalData.profesorId" 
              class="form-select"
              :disabled="!modalData.materiaId"
            >
              <option value="">Seleccionar profesor</option>
              <option 
                v-for="profesor in profesoresFiltrados" 
                :key="profesor.id" 
                :value="profesor.id"
              >
                {{ profesor.nombre }}
              </option>
            </select>
            <p v-if="tieneConflictoModal" class="form-help error">
              <font-awesome-icon icon="fa-exclamation-triangle" />
              Este profesor ya tiene una clase asignada en este horario
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button 
            class="btn btn-primary" 
            @click="guardarAsignacion"
            :disabled="!modalData.materiaId || !modalData.profesorId"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// Definición de interfaces
interface AnioLectivo {
  id: number;
  nombre: string;
}

interface Seccion {
  id: number;
  nombre: string;
  anioLectivoId: number;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Profesor {
  id: number;
  nombre: string;
  materias: number[];
}

interface Bloque {
  id: number;
  horaInicio: string;
  horaFin: string;
  esReceso?: boolean;
}

interface Asignacion {
  id: number;
  seccionId: number;
  dia: string;
  bloqueId: number;
  materiaId: number;
  profesorId: number;
  materia?: Materia;
  profesor?: Profesor;
}

interface ModalData {
  dia: string;
  bloque: Bloque | null;
  materiaId: string;
  profesorId: string;
}

// Datos de ejemplo (en producción vendrían de una API)
const aniosLectivos = ref<AnioLectivo[]>([
  { id: 1, nombre: '2025' },
  { id: 2, nombre: '2024' }
]);

const secciones = ref<Seccion[]>([]);
const materias = ref<Materia[]>([
  { id: 1, nombre: 'Matemáticas' },
  { id: 2, nombre: 'Español' },
  { id: 3, nombre: 'Ciencias' },
  { id: 4, nombre: 'Estudios Sociales' },
  { id: 5, nombre: 'Inglés' },
  { id: 6, nombre: 'Educación Física' },
  { id: 7, nombre: 'Artes' },
  { id: 8, nombre: 'Tecnología' }
]);

const profesores = ref<Profesor[]>([
  { id: 1, nombre: 'Prof. García', materias: [1, 2] },
  { id: 2, nombre: 'Prof. Rodríguez', materias: [3, 4] },
  { id: 3, nombre: 'Prof. López', materias: [5] },
  { id: 4, nombre: 'Prof. Martínez', materias: [6] },
  { id: 5, nombre: 'Prof. Hernández', materias: [7, 8] }
]);

// Estado del componente
const selectedAnioLectivo = ref<string>('');
const selectedSeccion = ref<string>('');
const horarioCargado = ref<boolean>(false);
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const bloques = ref<Bloque[]>([
  { id: 1, horaInicio: '7:00', horaFin: '7:40' },
  { id: 2, horaInicio: '7:40', horaFin: '8:20' },
  { id: 3, horaInicio: '8:20', horaFin: '9:00' },
  { id: 4, horaInicio: '9:00', horaFin: '9:20', esReceso: true },
  { id: 5, horaInicio: '9:20', horaFin: '10:00' },
  { id: 6, horaInicio: '10:00', horaFin: '10:40' },
  { id: 7, horaInicio: '10:40', horaFin: '11:20' },
  { id: 8, horaInicio: '11:20', horaFin: '12:00' }
]);

// Asignaciones de horario
const asignaciones = ref<Asignacion[]>([]);

// Modal de asignación
const showModal = ref<boolean>(false);
const modalData = ref<ModalData>({
  dia: '',
  bloque: null,
  materiaId: '',
  profesorId: ''
});

// Notificación personalizada
interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  timeout?: number;
}

const notification = ref<Notification>({
  show: false,
  message: '',
  type: 'info',
  icon: 'fa-info-circle',
  timeout: 3000
});

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

// Modal de confirmación
interface ConfirmModal {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  type: 'primary' | 'danger';
  action: () => void;
}

const confirmModal = ref<ConfirmModal>({
  show: false,
  title: '',
  message: '',
  confirmText: 'Confirmar',
  type: 'primary',
  action: () => {}
});

const showConfirmModal = (options: {
  title: string;
  message: string;
  confirmText?: string;
  type?: 'primary' | 'danger';
  action: () => void;
}) => {
  confirmModal.value = {
    show: true,
    title: options.title,
    message: options.message,
    confirmText: options.confirmText || 'Confirmar',
    type: options.type || 'primary',
    action: options.action
  };
};

const confirmAction = () => {
  confirmModal.value.action();
  confirmModal.value.show = false;
};

const cancelConfirmation = () => {
  confirmModal.value.show = false;
};

// Profesores filtrados por materia seleccionada
const profesoresFiltrados = computed(() => {
  if (!modalData.value.materiaId) return [];
  return profesores.value.filter(profesor => 
    profesor.materias.includes(Number(modalData.value.materiaId))
  );
});

// Verificar si hay conflicto en el modal actual
const tieneConflictoModal = computed(() => {
  if (!modalData.value.profesorId || !modalData.value.bloque || !modalData.value.dia) return false;
  
  return asignaciones.value.some(asignacion => 
    asignacion.profesorId === Number(modalData.value.profesorId) &&
    asignacion.bloqueId === modalData.value.bloque!.id &&
    asignacion.dia === modalData.value.dia &&
    !(asignacion.dia === modalData.value.dia && 
      asignacion.bloqueId === modalData.value.bloque!.id &&
      asignacion.seccionId === Number(selectedSeccion.value))
  );
});

// Cargar secciones cuando cambia el año lectivo
watch(selectedAnioLectivo, async (newValue) => {
  if (newValue) {
    // En producción, esto sería una llamada a la API
    secciones.value = [
      { id: 1, nombre: '1-A', anioLectivoId: 1 },
      { id: 2, nombre: '1-B', anioLectivoId: 1 },
      { id: 3, nombre: '2-A', anioLectivoId: 1 },
      { id: 4, nombre: '2-B', anioLectivoId: 1 },
      { id: 5, nombre: '3-A', anioLectivoId: 2 },
      { id: 6, nombre: '3-B', anioLectivoId: 2 }
    ].filter(seccion => seccion.anioLectivoId === Number(newValue));
  } else {
    secciones.value = [];
  }
  selectedSeccion.value = '';
  horarioCargado.value = false;
});

// Cargar horario
const cargarHorario = async () => {
  if (!selectedAnioLectivo.value || !selectedSeccion.value) return;
  
  // En producción, esto sería una llamada a la API
  // Simulamos una carga de datos
  asignaciones.value = [
    {
      id: 1,
      seccionId: 1,
      dia: 'Lunes',
      bloqueId: 1,
      materiaId: 1,
      profesorId: 1,
      materia: materias.value.find(m => m.id === 1),
      profesor: profesores.value.find(p => p.id === 1)
    },
    {
      id: 2,
      seccionId: 1,
      dia: 'Martes',
      bloqueId: 1,
      materiaId: 2,
      profesorId: 1,
      materia: materias.value.find(m => m.id === 2),
      profesor: profesores.value.find(p => p.id === 1)
    }
  ];
  
  horarioCargado.value = true;
};

// Limpiar horario
const limpiarHorario = () => {
  showConfirmModal({
    title: 'Limpiar Horario',
    message: '¿Está seguro que desea limpiar el horario? Se perderán todos los cambios no guardados.',
    confirmText: 'Limpiar',
    type: 'danger',
    action: () => {
      asignaciones.value = asignaciones.value.filter(a => a.seccionId !== Number(selectedSeccion.value));
      showNotification('Horario limpiado correctamente', 'info');
    }
  });
};

// Guardar horario
const guardarHorario = async () => {
  // En producción, esto sería una llamada a la API para guardar las asignaciones
  showNotification('Horario guardado con éxito', 'success');
};

// Abrir modal de asignación
const abrirModalAsignacion = (bloque: Bloque, dia: string) => {
  const asignacion = getAsignacion(bloque, dia);
  
  modalData.value = {
    dia,
    bloque,
    materiaId: asignacion ? String(asignacion.materiaId) : '',
    profesorId: asignacion ? String(asignacion.profesorId) : ''
  };
  
  showModal.value = true;
};

// Cerrar modal
const cerrarModal = () => {
  showModal.value = false;
  modalData.value = {
    dia: '',
    bloque: null,
    materiaId: '',
    profesorId: ''
  };
};

// Guardar asignación desde el modal
const guardarAsignacion = () => {
  const { dia, bloque, materiaId, profesorId } = modalData.value;
  if (!dia || !bloque || !materiaId || !profesorId) return;
  
  // Buscar si ya existe una asignación para esta celda
  const existingIndex = asignaciones.value.findIndex(a => 
    a.seccionId === Number(selectedSeccion.value) && 
    a.dia === dia && 
    a.bloqueId === bloque.id
  );
  
  // Obtener objetos completos de materia y profesor
  const materia = materias.value.find(m => m.id === Number(materiaId));
  const profesor = profesores.value.find(p => p.id === Number(profesorId));
  
  if (existingIndex >= 0) {
    // Actualizar asignación existente
    asignaciones.value[existingIndex] = {
      ...asignaciones.value[existingIndex],
      materiaId: Number(materiaId),
      profesorId: Number(profesorId),
      materia,
      profesor
    };
  } else {
    // Crear nueva asignación
    asignaciones.value.push({
      id: Date.now(), // Generar ID temporal
      seccionId: Number(selectedSeccion.value),
      dia,
      bloqueId: bloque.id,
      materiaId: Number(materiaId),
      profesorId: Number(profesorId),
      materia,
      profesor
    });
  }
  
  cerrarModal();
};

// Obtener asignación para una celda específica
const getAsignacion = (bloque: Bloque, dia: string): Asignacion | undefined => {
  return asignaciones.value.find(a => 
    a.seccionId === Number(selectedSeccion.value) && 
    a.dia === dia && 
    a.bloqueId === bloque.id
  );
};

// Verificar si hay conflicto en una celda
const tieneConflicto = (bloque: Bloque, dia: string): boolean => {
  const asignacion = getAsignacion(bloque, dia);
  if (!asignacion) return false;
  
  // Verificar si el profesor está asignado en otra sección en el mismo bloque y día
  return asignaciones.value.some(a => 
    a.profesorId === asignacion.profesorId &&
    a.bloqueId === bloque.id &&
    a.dia === dia &&
    a.seccionId !== Number(selectedSeccion.value)
  );
};

// Obtener clase CSS para la celda basada en la materia
const getCellClass = (bloque: Bloque, dia: string): string => {
  const asignacion = getAsignacion(bloque, dia);
  if (!asignacion) return '';
  
  const materiaMap: Record<number, string> = {
    1: 'math',
    2: 'spanish',
    3: 'science',
    4: 'social',
    5: 'english',
    6: 'pe',
    7: 'arts',
    8: 'tech'
  };
  
  return materiaMap[asignacion.materiaId] || '';
};

// Cargar datos iniciales
onMounted(async () => {
  // En producción, aquí se cargarían los datos iniciales desde la API
});
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/horarios.css';
@import '@/assets/styles/dashboards/direccion/gestionhorario.css';

</style>
