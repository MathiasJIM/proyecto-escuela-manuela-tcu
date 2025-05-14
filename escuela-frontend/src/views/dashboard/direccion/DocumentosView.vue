<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Documentos</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear nuevo documento
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filter-group">
        <div class="search-container">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar por nombre..."
            class="search-input"
          />
          <font-awesome-icon icon="fa-search" class="search-icon" />
        </div>

        <div class="filter-select-container">
          <label for="tipoFilter" class="filter-label">Tipo:</label>
          <select 
            id="tipoFilter" 
            v-model="filtroTipo" 
            class="filter-select"
          >
            <option value="">Todos</option>
            <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
        </div>

        <div class="filter-select-container">
          <label for="visibilidadFilter" class="filter-label">Visibilidad:</label>
          <select 
            id="visibilidadFilter" 
            v-model="filtroVisibilidad" 
            class="filter-select"
          >
            <option value="">Todos</option>
            <option value="direccion">Solo Dirección</option>
            <option value="profesores">Dirección y Profesores</option>
          </select>
        </div>
      </div>
      <div class="filter-info">
        <span>{{ documentosFiltrados.length }} documentos encontrados</span>
      </div>
    </div>

    <!-- Tabla de documentos -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-nombre">Nombre del documento</th>
            <th class="col-tipo">Tipo</th>
            <th class="col-fecha">Fecha de creación</th>
            <th class="col-usuario">Subido por</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="documentosFiltrados.length === 0">
            <td colspan="5" class="empty-message">
              No se encontraron documentos. Crea un nuevo documento para comenzar.
            </td>
          </tr>
          <tr v-for="documento in documentosFiltrados" :key="documento.id">
            <td class="documento-nombre">{{ documento.nombre }}</td>
            <td>{{ obtenerNombreTipo(documento.tipoId) }}</td>
            <td>{{ formatearFecha(documento.fechaCreacion) }}</td>
            <td>{{ documento.creadoPor }}</td>
            <td>
              <div class="acciones">
                <a :href="documento.url" target="_blank" class="btn-accion btn-ver" title="Ver documento">
                  <font-awesome-icon :icon="['fas', 'eye']" />
                </a>
                <button @click="editarDocumento(documento)" class="btn-accion btn-editar" title="Editar">
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button @click="confirmarEliminar(documento)" class="btn-accion btn-eliminar" title="Eliminar">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar documento -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicion ? 'Editar documento' : 'Crear nuevo documento' }}</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="guardarDocumento">
            <div class="form-group">
              <label for="nombreDocumento" class="form-label">Nombre del documento:</label>
              <input
                type="text"
                id="nombreDocumento"
                v-model="documentoForm.nombre"
                class="form-control"
                required
                placeholder="Ej: Circular Inicio de Curso"
              />
            </div>
            
            <div class="form-group">
              <label for="urlDocumento" class="form-label">URL del documento:</label>
              <input
                type="url"
                id="urlDocumento"
                v-model="documentoForm.url"
                class="form-control"
                required
                placeholder="https://ejemplo.com/documento"
              />
            </div>
            
            <div class="form-group">
              <label for="tipoDocumento" class="form-label">Tipo de documento:</label>
              <select
                id="tipoDocumento"
                v-model="documentoForm.tipoId"
                class="form-control"
                required
              >
                <option value="">Seleccione un tipo</option>
                <option v-for="tipo in tiposDocumento" :key="tipo.id" :value="tipo.id">
                  {{ tipo.nombre }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="visibilidadDocumento" class="form-label">Visibilidad:</label>
              <select
                id="visibilidadDocumento"
                v-model="documentoForm.visibilidad"
                class="form-control"
                required
              >
                <option value="">Seleccione la visibilidad</option>
                <option value="direccion">Solo Dirección</option>
                <option value="profesores">Dirección y Profesores</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button 
            class="btn btn-primary" 
            @click="guardarDocumento" 
            :disabled="!esFormularioValido"
          >
            {{ modoEdicion ? 'Guardar cambios' : 'Crear documento' }}
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
            ¿Está seguro que desea eliminar el documento <strong>{{ documentoAEliminar?.nombre }}</strong>?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEliminar">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="eliminarDocumento">
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
interface TipoDocumento {
  id: number;
  nombre: string;
}

interface Documento {
  id: number;
  nombre: string;
  url: string;
  tipoId: number;
  fechaCreacion: Date;
  creadoPor: string;
  visibilidad: 'direccion' | 'profesores';
}

interface DocumentoForm {
  id?: number;
  nombre: string;
  url: string;
  tipoId: number | string;
  visibilidad: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  timeout?: number;
}

// Estado
const tiposDocumento = ref<TipoDocumento[]>([
  { id: 1, nombre: 'Circular' },
  { id: 2, nombre: 'Planeamiento' },
  { id: 3, nombre: 'Normativa' },
  { id: 4, nombre: 'Formulario' },
  { id: 5, nombre: 'Otro' }
]);

const documentos = ref<Documento[]>([
  { 
    id: 1, 
    nombre: 'Circular Inicio de Curso 2025', 
    url: 'https://docs.google.com/document/d/1abc123', 
    tipoId: 1,
    fechaCreacion: new Date('2025-01-15'),
    creadoPor: 'Director/a',
    visibilidad: 'profesores'
  },
  { 
    id: 2, 
    nombre: 'Planeamiento Anual 2025', 
    url: 'https://docs.google.com/spreadsheets/d/1xyz456', 
    tipoId: 2,
    fechaCreacion: new Date('2025-01-20'),
    creadoPor: 'Subdirector/a',
    visibilidad: 'direccion'
  },
  { 
    id: 3, 
    nombre: 'Normativa de Evaluación', 
    url: 'https://drive.google.com/file/d/1def789', 
    tipoId: 3,
    fechaCreacion: new Date('2024-12-10'),
    creadoPor: 'Director/a',
    visibilidad: 'profesores'
  },
  { 
    id: 4, 
    nombre: 'Formulario de Solicitud de Materiales', 
    url: 'https://forms.google.com/xyz123', 
    tipoId: 4,
    fechaCreacion: new Date('2025-02-05'),
    creadoPor: 'Secretario/a',
    visibilidad: 'profesores'
  },
  { 
    id: 5, 
    nombre: 'Calendario Escolar 2025', 
    url: 'https://calendar.google.com/abc123', 
    tipoId: 5,
    fechaCreacion: new Date('2025-01-05'),
    creadoPor: 'Director/a',
    visibilidad: 'profesores'
  }
]);

const busqueda = ref('');
const filtroTipo = ref('');
const filtroVisibilidad = ref('');
const showModal = ref(false);
const showConfirmModal = ref(false);
const modoEdicion = ref(false);
const documentoForm = ref<DocumentoForm>({
  nombre: '',
  url: '',
  tipoId: '',
  visibilidad: ''
});
const documentoAEliminar = ref<Documento | null>(null);
const notification = ref<Notification>({
  show: false,
  message: '',
  type: 'info',
  icon: 'fa-info-circle',
  timeout: 3000
});

// Computed
const documentosFiltrados = computed(() => {
  let resultado = documentos.value;
  
  // Filtrar por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase();
    resultado = resultado.filter(doc => 
      doc.nombre.toLowerCase().includes(termino)
    );
  }
  
  // Filtrar por tipo
  if (filtroTipo.value) {
    resultado = resultado.filter(doc => 
      doc.tipoId === Number(filtroTipo.value)
    );
  }
  
  // Filtrar por visibilidad
  if (filtroVisibilidad.value) {
    resultado = resultado.filter(doc => 
      doc.visibilidad === filtroVisibilidad.value
    );
  }
  
  return resultado;
});

const esFormularioValido = computed(() => {
  return (
    documentoForm.value.nombre.trim() !== '' &&
    documentoForm.value.url.trim() !== '' &&
    documentoForm.value.tipoId !== '' &&
    documentoForm.value.visibilidad !== ''
  );
});

// Métodos
const abrirModalCrear = () => {
  modoEdicion.value = false;
  documentoForm.value = {
    nombre: '',
    url: '',
    tipoId: '',
    visibilidad: ''
  };
  showModal.value = true;
};

const editarDocumento = (documento: Documento) => {
  modoEdicion.value = true;
  documentoForm.value = {
    id: documento.id,
    nombre: documento.nombre,
    url: documento.url,
    tipoId: documento.tipoId,
    visibilidad: documento.visibilidad
  };
  showModal.value = true;
};

const cerrarModal = () => {
  showModal.value = false;
};

const guardarDocumento = () => {
  if (!esFormularioValido.value) return;
  
  if (modoEdicion.value) {
    // Editar documento existente
    const index = documentos.value.findIndex(d => d.id === documentoForm.value.id);
    if (index !== -1) {
      documentos.value[index] = {
        ...documentos.value[index],
        nombre: documentoForm.value.nombre,
        url: documentoForm.value.url,
        tipoId: Number(documentoForm.value.tipoId),
        visibilidad: documentoForm.value.visibilidad as 'direccion' | 'profesores'
      };
      showNotification('Documento actualizado correctamente', 'success');
    }
  } else {
    // Crear nuevo documento
    const newId = Math.max(0, ...documentos.value.map(d => d.id)) + 1;
    documentos.value.push({
      id: newId,
      nombre: documentoForm.value.nombre,
      url: documentoForm.value.url,
      tipoId: Number(documentoForm.value.tipoId),
      fechaCreacion: new Date(),
      creadoPor: 'Director/a', // En producción, esto vendría del usuario actual
      visibilidad: documentoForm.value.visibilidad as 'direccion' | 'profesores'
    });
    showNotification('Documento creado correctamente', 'success');
  }
  
  cerrarModal();
};

const confirmarEliminar = (documento: Documento) => {
  documentoAEliminar.value = documento;
  showConfirmModal.value = true;
};

const cancelarEliminar = () => {
  documentoAEliminar.value = null;
  showConfirmModal.value = false;
};

const eliminarDocumento = () => {
  if (!documentoAEliminar.value) return;
  
  const index = documentos.value.findIndex(d => d.id === documentoAEliminar.value?.id);
  if (index !== -1) {
    documentos.value.splice(index, 1);
    showNotification('Documento eliminado correctamente', 'success');
  }
  
  cancelarEliminar();
};

const obtenerNombreTipo = (tipoId: number): string => {
  const tipo = tiposDocumento.value.find(t => t.id === tipoId);
  return tipo ? tipo.nombre : '';
};

const formatearFecha = (fecha: Date): string => {
  return new Date(fecha).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
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

/* Tabla de documentos */
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

.col-nombre {
  width: 30%;
}

.col-tipo {
  width: 15%;
}

.col-fecha {
  width: 15%;
}

.col-usuario {
  width: 15%;
}

.col-acciones {
  width: 25%;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
}

.documento-nombre {
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
  text-decoration: none;
}

.btn-ver {
  background-color: #eff6ff;
  color: #3b82f6;
}

.btn-ver:hover {
  color: #2563eb;
}

.btn-editar {
  background-color: #ecfdf5;
  color: #10b981;
}

.btn-editar:hover {
  color: #059669;
}

.btn-eliminar {
  background-color: #fef2f2;
  color: #ef4444;
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
}
</style>
