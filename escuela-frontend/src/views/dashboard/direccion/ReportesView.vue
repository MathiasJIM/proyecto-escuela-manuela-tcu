<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Reportes de Asistencia Estudiantil</h1>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-group">
        <!-- Año lectivo -->
        <div class="filter-select-container">
          <label for="anioLectivo" class="filter-label">Año Lectivo:</label>
          <select 
            id="anioLectivo" 
            v-model="filtros.anioLectivo" 
            class="filter-select"
          >
            <option value="">Todos</option>
            <option v-for="anio in aniosLectivos" :key="anio.id" :value="anio.id">
              {{ anio.anio }} {{ anio.activo ? '(Activo)' : '' }}
            </option>
          </select>
        </div>

        <!-- Mes -->
        <div class="filter-select-container">
          <label for="mes" class="filter-label">Mes:</label>
          <select 
            id="mes" 
            v-model="filtros.mes" 
            class="filter-select"
          >
            <option value="">Todos</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>

        <!-- Sección -->
        <div class="filter-select-container">
          <label for="seccion" class="filter-label">Sección:</label>
          <select 
            id="seccion" 
            v-model="filtros.seccion" 
            class="filter-select"
            @change="cargarEstudiantes"
          >
            <option value="">Todas</option>
            <option v-for="seccion in secciones" :key="seccion.id" :value="seccion.id">
              {{ seccion.nombre }}
            </option>
          </select>
        </div>

        <!-- Estudiante -->
        <div class="filter-select-container">
          <label for="estudiante" class="filter-label">Estudiante:</label>
          <select 
            id="estudiante" 
            v-model="filtros.estudiante" 
            class="filter-select"
            :disabled="!filtros.seccion"
          >
            <option value="">Todos</option>
            <option v-for="estudiante in estudiantesFiltrados" :key="estudiante.id" :value="estudiante.id">
              {{ estudiante.nombre }}
            </option>
          </select>
        </div>

        <!-- Tipo de inasistencia -->
        <div class="filter-select-container">
          <label for="tipoInasistencia" class="filter-label">Tipo de inasistencia:</label>
          <select 
            id="tipoInasistencia" 
            v-model="filtros.tipoInasistencia" 
            class="filter-select"
          >
            <option value="">Todas</option>
            <option value="justificada">Justificada</option>
            <option value="injustificada">Injustificada</option>
          </select>
        </div>
      </div>

      <div class="filter-actions">
        <button @click="generarReporte" class="btn btn-primary">
          <font-awesome-icon :icon="['fas', 'file-alt']" />
          Generar Reporte
        </button>
        <button @click="exportarCSV" class="btn btn-secondary">
          <font-awesome-icon :icon="['fas', 'file-csv']" />
          Exportar CSV
        </button>
        <button @click="exportarPDF" class="btn btn-secondary">
          <font-awesome-icon :icon="['fas', 'file-pdf']" />
          Exportar PDF
        </button>
      </div>
    </div>

    <!-- Tabla de resultados -->
    <div class="table-container" v-if="reporteGenerado">
      <div class="table-info">
        <h2 class="subtitle">Resultados del Reporte</h2>
        <p class="results-count">{{ datosReporte.length }} estudiantes encontrados</p>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre del Estudiante</th>
              <th>Sección</th>
              <th>Total Asistencias</th>
              <th>Inasistencias Justificadas</th>
              <th>Inasistencias Injustificadas</th>
              <th>Porcentaje de Asistencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="datosReporte.length === 0">
              <td colspan="7" class="empty-message">
                No se encontraron datos para los filtros seleccionados.
              </td>
            </tr>
            <tr v-for="estudiante in datosReporte" :key="estudiante.id">
              <td>{{ estudiante.nombre }}</td>
              <td>{{ estudiante.seccion }}</td>
              <td>{{ estudiante.totalAsistencias }}</td>
              <td>{{ estudiante.inasistenciasJustificadas }}</td>
              <td>{{ estudiante.inasistenciasInjustificadas }}</td>
              <td>
                <div class="porcentaje-container">
                  <div class="porcentaje-barra">
                    <div 
                      class="porcentaje-valor" 
                      :style="{ width: estudiante.porcentajeAsistencia + '%' }"
                      :class="{ 
                        'porcentaje-alto': estudiante.porcentajeAsistencia >= 90,
                        'porcentaje-medio': estudiante.porcentajeAsistencia >= 75 && estudiante.porcentajeAsistencia < 90,
                        'porcentaje-bajo': estudiante.porcentajeAsistencia < 75
                      }"
                    ></div>
                  </div>
                  <span class="porcentaje-texto">{{ estudiante.porcentajeAsistencia }}%</span>
                </div>
              </td>
              <td>
                <div class="acciones">
                  <button 
                    @click="verDetalles(estudiante)" 
                    class="btn-accion btn-ver"
                    title="Ver detalles"
                  >
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mensaje cuando no hay reporte generado -->
    <div class="no-report-message" v-if="!reporteGenerado">
      <div class="message-container">
        <font-awesome-icon :icon="['fas', 'chart-bar']" class="message-icon" />
        <h3>No hay datos para mostrar</h3>
        <p>Selecciona los filtros deseados y haz clic en "Generar Reporte" para ver los resultados.</p>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div class="modal-overlay" v-if="showDetallesModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Detalles de Asistencia</h2>
          <button class="modal-close-btn" @click="cerrarModalDetalles">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>
        <div class="modal-content">
          <div v-if="estudianteSeleccionado" class="detalles-estudiante">
            <div class="detalles-header">
              <h3>{{ estudianteSeleccionado.nombre }}</h3>
              <p>Sección: {{ estudianteSeleccionado.seccion }}</p>
            </div>
            
            <div class="detalles-resumen">
              <div class="resumen-item">
                <span class="resumen-valor">{{ estudianteSeleccionado.totalAsistencias }}</span>
                <span class="resumen-label">Asistencias</span>
              </div>
              <div class="resumen-item">
                <span class="resumen-valor">{{ estudianteSeleccionado.inasistenciasJustificadas }}</span>
                <span class="resumen-label">Justificadas</span>
              </div>
              <div class="resumen-item">
                <span class="resumen-valor">{{ estudianteSeleccionado.inasistenciasInjustificadas }}</span>
                <span class="resumen-label">Injustificadas</span>
              </div>
              <div class="resumen-item">
                <span class="resumen-valor">{{ estudianteSeleccionado.porcentajeAsistencia }}%</span>
                <span class="resumen-label">Asistencia</span>
              </div>
            </div>

            <h4>Registro de Asistencia</h4>
            <div class="detalles-tabla">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Justificación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(registro, index) in estudianteSeleccionado.registros" :key="index">
                    <td>{{ formatearFecha(registro.fecha) }}</td>
                    <td>
                      <span 
                        class="estado-badge"
                        :class="{
                          'estado-presente': registro.estado === 'presente',
                          'estado-justificada': registro.estado === 'justificada',
                          'estado-injustificada': registro.estado === 'injustificada'
                        }"
                      >
                        {{ obtenerEstadoTexto(registro.estado) }}
                      </span>
                    </td>
                    <td>{{ registro.justificacion || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Interfaces
interface AnioLectivo {
  id: number;
  anio: string;
  activo: boolean;
}

interface Seccion {
  id: number;
  nombre: string;
  anioLectivoId: number;
}

interface Estudiante {
  id: number;
  nombre: string;
  seccionId: number;
  seccion: string;
}

interface Filtros {
  anioLectivo: number | string;
  mes: number | string;
  seccion: number | string;
  estudiante: number | string;
  tipoInasistencia: string;
}

interface RegistroAsistencia {
  fecha: Date;
  estado: 'presente' | 'justificada' | 'injustificada';
  justificacion?: string;
}

interface DatosReporte {
  id: number;
  nombre: string;
  seccion: string;
  totalAsistencias: number;
  inasistenciasJustificadas: number;
  inasistenciasInjustificadas: number;
  porcentajeAsistencia: number;
  registros: RegistroAsistencia[];
}

// Estado
const aniosLectivos = ref<AnioLectivo[]>([
  { id: 1, anio: '2025', activo: true },
  { id: 2, anio: '2024', activo: false },
  { id: 3, anio: '2023', activo: false }
]);

const secciones = ref<Seccion[]>([
  { id: 1, nombre: '1-A', anioLectivoId: 1 },
  { id: 2, nombre: '1-B', anioLectivoId: 1 },
  { id: 3, nombre: '2-A', anioLectivoId: 1 },
  { id: 4, nombre: '2-B', anioLectivoId: 1 },
  { id: 5, nombre: '3-A', anioLectivoId: 1 },
  { id: 6, nombre: '3-B', anioLectivoId: 1 },
  { id: 7, nombre: '1-A', anioLectivoId: 2 },
  { id: 8, nombre: '1-B', anioLectivoId: 2 }
]);

const estudiantes = ref<Estudiante[]>([
  { id: 1, nombre: 'Ana García', seccionId: 1, seccion: '1-A' },
  { id: 2, nombre: 'Carlos Rodríguez', seccionId: 1, seccion: '1-A' },
  { id: 3, nombre: 'María López', seccionId: 1, seccion: '1-A' },
  { id: 4, nombre: 'Juan Pérez', seccionId: 2, seccion: '1-B' },
  { id: 5, nombre: 'Laura Martínez', seccionId: 2, seccion: '1-B' },
  { id: 6, nombre: 'Pedro Sánchez', seccionId: 3, seccion: '2-A' },
  { id: 7, nombre: 'Sofía Hernández', seccionId: 3, seccion: '2-A' },
  { id: 8, nombre: 'Diego Ramírez', seccionId: 4, seccion: '2-B' }
]);

const filtros = ref<Filtros>({
  anioLectivo: 1, // Por defecto, el año activo
  mes: '',
  seccion: '',
  estudiante: '',
  tipoInasistencia: ''
});

const reporteGenerado = ref(false);
const datosReporte = ref<DatosReporte[]>([]);
const showDetallesModal = ref(false);
const estudianteSeleccionado = ref<DatosReporte | null>(null);

// Computed
const estudiantesFiltrados = computed(() => {
  if (!filtros.value.seccion) return [];
  return estudiantes.value.filter(e => e.seccionId === Number(filtros.value.seccion));
});

// Métodos
const cargarEstudiantes = () => {
  filtros.value.estudiante = '';
};

const generarReporte = () => {
  // En producción, aquí se haría una llamada a la API
  // Por ahora, generamos datos de ejemplo
  const resultados: DatosReporte[] = [];
  
  // Filtramos los estudiantes según los criterios
  let estudiantesFiltro = estudiantes.value;
  
  if (filtros.value.seccion) {
    estudiantesFiltro = estudiantesFiltro.filter(e => e.seccionId === Number(filtros.value.seccion));
  }
  
  if (filtros.value.estudiante) {
    estudiantesFiltro = estudiantesFiltro.filter(e => e.id === Number(filtros.value.estudiante));
  }
  
  // Generamos datos aleatorios para cada estudiante
  estudiantesFiltro.forEach(estudiante => {
    // Generamos registros de asistencia aleatorios
    const registros: RegistroAsistencia[] = [];
    const totalDias = 20; // Ejemplo: 20 días de clase en el mes
    let presentes = 0;
    let justificadas = 0;
    let injustificadas = 0;
    
    for (let i = 1; i <= totalDias; i++) {
      const fecha = new Date(2025, filtros.value.mes ? Number(filtros.value.mes) - 1 : 4, i);
      const random = Math.random();
      let estado: 'presente' | 'justificada' | 'injustificada';
      let justificacion = undefined;
      
      if (random < 0.85) {
        estado = 'presente';
        presentes++;
      } else if (random < 0.95) {
        estado = 'justificada';
        justificadas++;
        justificacion = 'Cita médica';
      } else {
        estado = 'injustificada';
        injustificadas++;
      }
      
      registros.push({ fecha, estado, justificacion });
    }
    
    // Filtramos por tipo de inasistencia si es necesario
    if (filtros.value.tipoInasistencia) {
      if (filtros.value.tipoInasistencia === 'justificada' && justificadas === 0) return;
      if (filtros.value.tipoInasistencia === 'injustificada' && injustificadas === 0) return;
    }
    
    const porcentaje = Math.round((presentes / totalDias) * 100);
    
    resultados.push({
      id: estudiante.id,
      nombre: estudiante.nombre,
      seccion: estudiante.seccion,
      totalAsistencias: presentes,
      inasistenciasJustificadas: justificadas,
      inasistenciasInjustificadas: injustificadas,
      porcentajeAsistencia: porcentaje,
      registros: registros
    });
  });
  
  datosReporte.value = resultados;
  reporteGenerado.value = true;
};

const verDetalles = (estudiante: DatosReporte) => {
  estudianteSeleccionado.value = estudiante;
  showDetallesModal.value = true;
};

const cerrarModalDetalles = () => {
  showDetallesModal.value = false;
  estudianteSeleccionado.value = null;
};

const exportarCSV = () => {
  if (datosReporte.value.length === 0) return;
  
  // Crear contenido CSV
  let csvContent = 'Nombre,Sección,Total Asistencias,Inasistencias Justificadas,Inasistencias Injustificadas,Porcentaje de Asistencia\n';
  
  datosReporte.value.forEach(estudiante => {
    csvContent += `"${estudiante.nombre}","${estudiante.seccion}",${estudiante.totalAsistencias},${estudiante.inasistenciasJustificadas},${estudiante.inasistenciasInjustificadas},${estudiante.porcentajeAsistencia}\n`;
  });
  
  // Crear y descargar el archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'reporte_asistencia.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportarPDF = () => {
  // En una implementación real, se utilizaría una biblioteca como jsPDF
  alert('Funcionalidad de exportar a PDF en desarrollo');
};

const formatearFecha = (fecha: Date): string => {
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const obtenerEstadoTexto = (estado: string): string => {
  switch (estado) {
    case 'presente': return 'Presente';
    case 'justificada': return 'Justificada';
    case 'injustificada': return 'Injustificada';
    default: return estado;
  }
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

.subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

/* Filtros */
.filters-container {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-select-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 180px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

/* Botones */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color, #3b82f6);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: var(--primary-light, #60a5fa);
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

/* Tabla */
.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.table-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.results-count {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f9fafb;
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.empty-message {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}

/* Porcentaje de asistencia */
.porcentaje-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.porcentaje-barra {
  flex-grow: 1;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.porcentaje-valor {
  height: 100%;
  border-radius: 4px;
}

.porcentaje-alto {
  background-color: #10b981;
}

.porcentaje-medio {
  background-color: #f59e0b;
}

.porcentaje-bajo {
  background-color: #ef4444;
}

.porcentaje-texto {
  font-weight: 600;
  min-width: 40px;
  text-align: right;
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

.btn-ver:hover {
  color: #2563eb;
}

/* Mensaje cuando no hay reporte */
.no-report-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 24px;
}

.message-container {
  text-align: center;
  max-width: 400px;
  padding: 24px;
}

.message-icon {
  font-size: 48px;
  color: #9ca3af;
  margin-bottom: 16px;
}

/* Modal */
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Detalles del estudiante */
.detalles-estudiante {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detalles-header {
  margin-bottom: 16px;
}

.detalles-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.detalles-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.detalles-resumen {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.resumen-item {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  min-width: 120px;
  flex: 1;
  text-align: center;
}

.resumen-valor {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.resumen-label {
  font-size: 14px;
  color: #6b7280;
}

.detalles-tabla {
  margin-top: 16px;
}

.estado-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.estado-presente {
  background-color: #d1fae5;
  color: #047857;
}

.estado-justificada {
  background-color: #fef3c7;
  color: #92400e;
}

.estado-injustificada {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-select-container {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .table-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .detalles-resumen {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
