<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Ver Horario</h1>
      <button @click="imprimirHorario" class="btn btn-secondary" v-if="horarioCargado">
        <font-awesome-icon icon="fa-print" />
        Imprimir Horario
      </button>
    </div>

    <div class="filters-container">
      <div class="filter-group">
        <label for="anioLectivoFilter" class="filter-label">Año Lectivo:</label>
        <select 
          id="anioLectivoFilter" 
          v-model="anioLectivoSeleccionado" 
          class="filter-select"
        >
          <option value="">Seleccione un año lectivo</option>
          <option 
            v-for="anio in aniosLectivos" 
            :key="anio.id" 
            :value="anio.id"
          >
            {{ anio.nombre }}
          </option>
        </select>

        <label for="verPorFilter" class="filter-label">Ver por:</label>
        <select 
          id="verPorFilter" 
          v-model="verPor" 
          class="filter-select"
        >
          <option value="seccion">Sección</option>
          <option value="profesor">Profesor</option>
        </select>

        <template v-if="verPor === 'seccion'">
          <label for="seccionFilter" class="filter-label">Sección:</label>
          <select 
            id="seccionFilter" 
            v-model="seccionSeleccionada" 
            class="filter-select"
            :disabled="!anioLectivoSeleccionado"
          >
            <option value="">Seleccione una sección</option>
            <option 
              v-for="seccion in seccionesFiltradas" 
              :key="seccion.id" 
              :value="seccion.id"
            >
              {{ seccion.nombre }}
            </option>
          </select>
        </template>

        <template v-else>
          <label for="profesorFilter" class="filter-label">Profesor:</label>
          <select 
            id="profesorFilter" 
            v-model="profesorSeleccionado" 
            class="filter-select"
          >
            <option value="">Seleccione un profesor</option>
            <option 
              v-for="profesor in profesores" 
              :key="profesor.id" 
              :value="profesor.id"
            >
              {{ profesor.nombre }}
            </option>
          </select>
        </template>

        <button 
          @click="cargarHorario" 
          class="btn btn-primary"
          :disabled="!puedeCargarHorario"
        >
          <font-awesome-icon icon="fa-search" />
          Cargar Horario
        </button>
      </div>
    </div>

    <div v-if="!horarioCargado" class="empty-state">
      <div class="empty-state-content">
        <font-awesome-icon icon="fa-clock" class="empty-state-icon" />
        <h3 class="empty-state-title">No hay horario registrado</h3>
        <p class="empty-state-message">
          {{ 
            verPor === 'seccion' 
              ? 'No hay horario registrado para esta sección en el año seleccionado.' 
              : 'No hay horario registrado para este profesor en el año seleccionado.'
          }}
        </p>
      </div>
    </div>

    <div v-else class="schedule-container">
      <div class="schedule-header">
        <h2 class="schedule-title">
          {{ 
            verPor === 'seccion' 
              ? `Horario: ${obtenerNombreSeccion(seccionSeleccionada)}` 
              : `Horario: ${obtenerNombreProfesor(profesorSeleccionado)}`
          }}
        </h2>
        <p class="schedule-subtitle">Año Lectivo: {{ obtenerNombreAnioLectivo(anioLectivoSeleccionado) }}</p>
      </div>
      
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
              :class="[
                'schedule-cell',
                getClaseEstilo(getAsignacion(bloque, dia))
              ]"
            >
              <div v-if="getAsignacion(bloque, dia)" class="schedule-slot">
                <div class="schedule-slot-subject">
                  {{ getAsignacion(bloque, dia)?.materia?.nombre || 'Sin materia' }}
                </div>
                <div class="schedule-slot-teacher" v-if="verPor === 'seccion'">
                  {{ getAsignacion(bloque, dia)?.profesor?.nombre || 'Sin profesor' }}
                </div>
                <div class="schedule-slot-section" v-else>
                  {{ getAsignacion(bloque, dia)?.seccion?.nombre || 'Sin sección' }}
                </div>
              </div>
              <div v-else class="empty-slot">
                <span class="empty-slot-text">-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

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

interface Profesor {
  id: number;
  nombre: string;
  materias: number[];
}

interface Materia {
  id: number;
  nombre: string;
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
  seccion?: Seccion;
}

// Datos de ejemplo (en producción vendrían de una API)
const aniosLectivos = ref<AnioLectivo[]>([
  { id: 1, nombre: '2025' },
  { id: 2, nombre: '2024' }
]);

const secciones = ref<Seccion[]>([
  { id: 1, nombre: '1-A', anioLectivoId: 1 },
  { id: 2, nombre: '1-B', anioLectivoId: 1 },
  { id: 3, nombre: '2-A', anioLectivoId: 1 },
  { id: 4, nombre: '2-B', anioLectivoId: 1 },
  { id: 5, nombre: '3-A', anioLectivoId: 2 },
  { id: 6, nombre: '3-B', anioLectivoId: 2 }
]);

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
const anioLectivoSeleccionado = ref<string | number>('');
const verPor = ref<'seccion' | 'profesor'>('seccion');
const seccionSeleccionada = ref<string | number>('');
const profesorSeleccionado = ref<string | number>('');
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

// Secciones filtradas por año lectivo seleccionado
const seccionesFiltradas = computed(() => {
  if (!anioLectivoSeleccionado.value) return [];
  return secciones.value.filter(seccion => 
    seccion.anioLectivoId === Number(anioLectivoSeleccionado.value)
  );
});

// Verificar si se puede cargar el horario
const puedeCargarHorario = computed(() => {
  if (!anioLectivoSeleccionado.value) return false;
  
  if (verPor.value === 'seccion') {
    return !!seccionSeleccionada.value;
  } else {
    return !!profesorSeleccionado.value;
  }
});

// Resetear selecciones cuando cambia el tipo de vista
watch(verPor, () => {
  seccionSeleccionada.value = '';
  profesorSeleccionado.value = '';
  horarioCargado.value = false;
});

// Resetear sección seleccionada cuando cambia el año lectivo
watch(anioLectivoSeleccionado, () => {
  seccionSeleccionada.value = '';
  horarioCargado.value = false;
});

// Cargar horario
const cargarHorario = async () => {
  if (!puedeCargarHorario.value) return;
  
  // En producción, esto sería una llamada a la API
  // Simulamos una carga de datos
  if (verPor.value === 'seccion') {
    // Datos de ejemplo para sección
    asignaciones.value = [
      {
        id: 1,
        seccionId: Number(seccionSeleccionada.value),
        dia: 'Lunes',
        bloqueId: 1,
        materiaId: 1,
        profesorId: 1,
        materia: materias.value.find(m => m.id === 1),
        profesor: profesores.value.find(p => p.id === 1)
      },
      {
        id: 2,
        seccionId: Number(seccionSeleccionada.value),
        dia: 'Martes',
        bloqueId: 1,
        materiaId: 2,
        profesorId: 1,
        materia: materias.value.find(m => m.id === 2),
        profesor: profesores.value.find(p => p.id === 1)
      },
      {
        id: 3,
        seccionId: Number(seccionSeleccionada.value),
        dia: 'Miércoles',
        bloqueId: 2,
        materiaId: 3,
        profesorId: 2,
        materia: materias.value.find(m => m.id === 3),
        profesor: profesores.value.find(p => p.id === 2)
      }
    ];
  } else {
    // Datos de ejemplo para profesor
    asignaciones.value = [
      {
        id: 1,
        seccionId: 1,
        dia: 'Lunes',
        bloqueId: 1,
        materiaId: 1,
        profesorId: Number(profesorSeleccionado.value),
        materia: materias.value.find(m => m.id === 1),
        profesor: profesores.value.find(p => p.id === Number(profesorSeleccionado.value)),
        seccion: secciones.value.find(s => s.id === 1)
      },
      {
        id: 2,
        seccionId: 2,
        dia: 'Martes',
        bloqueId: 1,
        materiaId: 1,
        profesorId: Number(profesorSeleccionado.value),
        materia: materias.value.find(m => m.id === 1),
        profesor: profesores.value.find(p => p.id === Number(profesorSeleccionado.value)),
        seccion: secciones.value.find(s => s.id === 2)
      }
    ];
  }
  
  horarioCargado.value = true;
};

// Obtener asignación para una celda específica
const getAsignacion = (bloque: Bloque, dia: string): Asignacion | undefined => {
  return asignaciones.value.find(a => 
    a.dia === dia && 
    a.bloqueId === bloque.id
  );
};

// Obtener estilo de clase basado en la materia
const getClaseEstilo = (asignacion?: Asignacion): string => {
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

// Obtener nombre de sección
const obtenerNombreSeccion = (seccionId: string | number): string => {
  if (!seccionId) return '';
  const seccion = secciones.value.find(s => s.id === Number(seccionId));
  return seccion ? seccion.nombre : '';
};

// Obtener nombre de profesor
const obtenerNombreProfesor = (profesorId: string | number): string => {
  if (!profesorId) return '';
  const profesor = profesores.value.find(p => p.id === Number(profesorId));
  return profesor ? profesor.nombre : '';
};

// Obtener nombre de año lectivo
const obtenerNombreAnioLectivo = (anioId: string | number): string => {
  if (!anioId) return '';
  const anio = aniosLectivos.value.find(a => a.id === Number(anioId));
  return anio ? anio.nombre : '';
};

// Imprimir horario
const imprimirHorario = () => {
  window.print();
};
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/horarios.css';

/* Estilos adicionales específicos para este componente */
.empty-state {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  margin-bottom: 32px;
}

.empty-state-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.empty-state-message {
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
}

/* Estilos para la cuadrícula de horario */
.schedule-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 32px;
}

.schedule-header {
  margin-bottom: 20px;
  text-align: center;
}

.schedule-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.schedule-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.schedule-table th {
  padding: 8px;
  font-size: 0.8rem;
  text-align: center;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  font-weight: 600;
}

.schedule-table td {
  padding: 8px;
  height: 65px;
  max-width: 130px;
  border: 1px solid #e5e7eb;
  vertical-align: top;
}

.schedule-table .time-cell {
  width: 85px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #4b5563;
  text-align: center;
  background-color: #f9fafb;
}

.schedule-table .day-header {
  min-width: 130px;
}

/* Estilos para las celdas */
.schedule-cell {
  transition: background-color 0.2s;
}

.empty-slot {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-slot-text {
  font-size: 14px;
  color: #9ca3af;
}

.schedule-slot {
  padding: 6px;
  border-radius: 4px;
  font-size: 11px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.schedule-slot-subject {
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.schedule-slot-teacher,
.schedule-slot-section {
  font-size: 9px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* Estilos para materias */
.math {
  background-color: #dbeafe;
}

.spanish {
  background-color: #fef3c7;
}

.science {
  background-color: #d1fae5;
}

.social {
  background-color: #fee2e2;
}

.english {
  background-color: #e0e7ff;
}

.pe {
  background-color: #fce7f3;
}

.arts {
  background-color: #fef3c7;
}

.tech {
  background-color: #e0e7ff;
}

/* Estilos para impresión */
@media print {
  .header button,
  .filters-container {
    display: none;
  }
  
  .container {
    padding: 0;
  }
  
  .schedule-container {
    box-shadow: none;
    padding: 0;
  }
  
  .schedule-table {
    width: 100%;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    flex-wrap: wrap;
    margin-bottom: 16px;
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .schedule-table {
    font-size: 10px;
  }
  
  .schedule-table td {
    padding: 4px;
    height: 45px;
  }
  
  .schedule-table .time-cell {
    width: 60px;
    font-size: 0.7rem;
  }
  
  .schedule-table .day-header {
    min-width: 70px;
  }
}
</style>
