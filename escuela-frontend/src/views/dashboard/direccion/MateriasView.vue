<template>
  <div class="container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Materias</h1>
      <button @click="abrirModalCrear" class="btn btn-primary">
        <font-awesome-icon icon="fa-plus" />
        Crear nueva materia
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
      </div>
      <div class="filter-info">
        <span>{{ materiasFiltradas.length }} materias encontradas</span>
      </div>
    </div>

    <!-- Tabla de materias -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-nombre">Nombre de la materia</th>
            <th class="col-profesores">Profesores asignados</th>
            <th class="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="materiasFiltradas.length === 0">
            <td colspan="3" class="empty-message">
              No se encontraron materias. Crea una nueva materia para comenzar.
            </td>
          </tr>
          <tr v-for="materia in materiasFiltradas" :key="materia.id">
            <td class="materia-nombre">{{ materia.nombre }}</td>
            <td>
              <div class="count-with-action">
                <span class="count">{{ materia.profesores.length }}</span>
                <button 
                  @click="verDetalleProfesores(materia)" 
                  class="btn btn-sm btn-outline"
                  :disabled="materia.profesores.length === 0"
                >
                  Ver detalle
                </button>
              </div>
            </td>

            <td>
              <div class="acciones">
                <button @click="editarMateria(materia)" class="btn-accion btn-editar" title="Editar">
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button @click="confirmarEliminar(materia)" class="btn-accion btn-eliminar" title="Eliminar">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar materia -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicion ? 'Editar materia' : 'Crear nueva materia' }}</h2>
          <button class="modal-close-btn" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="guardarMateria">
            <div class="form-group">
              <label for="nombreMateria" class="form-label">Nombre de la materia:</label>
              <input
                type="text"
                id="nombreMateria"
                v-model="materiaForm.nombre"
                class="form-control"
                required
                placeholder="Ej: Matemáticas"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="guardarMateria" :disabled="!materiaForm.nombre">
            {{ modoEdicion ? 'Guardar cambios' : 'Crear materia' }}
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
            ¿Está seguro que desea eliminar la materia <strong>{{ materiaAEliminar?.nombre }}</strong>?
            <br><br>
            <span class="warning-text" v-if="materiaAEliminar && materiaAEliminar.profesores.length > 0">
              <font-awesome-icon icon="fa-exclamation-triangle" /> Esta materia está asignada a 
              {{ materiaAEliminar.profesores.length }} profesor(es).
            </span>
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelarEliminar">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="eliminarMateria">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalle de profesores -->
    <div class="modal-overlay" v-if="showProfesoresModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Profesores de {{ materiaSeleccionada?.nombre }}</h2>
          <button class="modal-close-btn" @click="cerrarDetalleProfesores">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-content">
          <div v-if="materiaSeleccionada && materiaSeleccionada.profesores.length > 0">
            <ul class="profesores-list">
              <li v-for="profesor in materiaSeleccionada.profesores" :key="profesor.id" class="profesor-item">
                <div class="profesor-info">
                  <span class="profesor-nombre">{{ profesor.nombre }}</span>
                  <span class="profesor-email">{{ profesor.email }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="empty-message">
            No hay profesores asignados a esta materia.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="cerrarDetalleProfesores">
            Cerrar
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
interface Profesor {
  id: number;
  nombre: string;
  email: string;
}



interface Materia {
  id: number;
  nombre: string;
  profesores: Profesor[];
}

interface MateriaForm {
  id?: number;
  nombre: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  timeout?: number;
}

// Estado
const materias = ref<Materia[]>([
  { 
    id: 1, 
    nombre: 'Matemáticas', 
    profesores: [
      { id: 1, nombre: 'Prof. García', email: 'garcia@escuela.edu' },
      { id: 2, nombre: 'Prof. Rodríguez', email: 'rodriguez@escuela.edu' }
    ]
  },
  { 
    id: 2, 
    nombre: 'Español', 
    profesores: [
      { id: 1, nombre: 'Prof. García', email: 'garcia@escuela.edu' }
    ]
  },
  { 
    id: 3, 
    nombre: 'Ciencias', 
    profesores: [
      { id: 3, nombre: 'Prof. López', email: 'lopez@escuela.edu' }
    ]
  },
  { 
    id: 4, 
    nombre: 'Estudios Sociales', 
    profesores: [
      { id: 4, nombre: 'Prof. Martínez', email: 'martinez@escuela.edu' }
    ]
  },
  { 
    id: 5, 
    nombre: 'Inglés', 
    profesores: []
  }
]);

const busqueda = ref('');
const showModal = ref(false);
const showConfirmModal = ref(false);
const showProfesoresModal = ref(false);
const modoEdicion = ref(false);
const materiaForm = ref<MateriaForm>({ nombre: '' });
const materiaAEliminar = ref<Materia | null>(null);
const materiaSeleccionada = ref<Materia | null>(null);
const notification = ref<Notification>({
  show: false,
  message: '',
  type: 'info',
  icon: 'fa-info-circle',
  timeout: 3000
});

// Computed
const materiasFiltradas = computed(() => {
  if (!busqueda.value) return materias.value;
  
  const termino = busqueda.value.toLowerCase();
  return materias.value.filter(materia => 
    materia.nombre.toLowerCase().includes(termino)
  );
});

// Métodos
const abrirModalCrear = () => {
  modoEdicion.value = false;
  materiaForm.value = { nombre: '' };
  showModal.value = true;
};

const editarMateria = (materia: Materia) => {
  modoEdicion.value = true;
  materiaForm.value = { 
    id: materia.id,
    nombre: materia.nombre 
  };
  showModal.value = true;
};

const cerrarModal = () => {
  showModal.value = false;
};

const guardarMateria = () => {
  if (!materiaForm.value.nombre) return;
  
  if (modoEdicion.value) {
    // Editar materia existente
    const index = materias.value.findIndex(m => m.id === materiaForm.value.id);
    if (index !== -1) {
      materias.value[index].nombre = materiaForm.value.nombre;
      showNotification('Materia actualizada correctamente', 'success');
    }
  } else {
    // Crear nueva materia
    const newId = Math.max(0, ...materias.value.map(m => m.id)) + 1;
    materias.value.push({
      id: newId,
      nombre: materiaForm.value.nombre,
      profesores: []
    });
    showNotification('Materia creada correctamente', 'success');
  }
  
  cerrarModal();
};

const confirmarEliminar = (materia: Materia) => {
  materiaAEliminar.value = materia;
  showConfirmModal.value = true;
};

const cancelarEliminar = () => {
  materiaAEliminar.value = null;
  showConfirmModal.value = false;
};

const eliminarMateria = () => {
  if (!materiaAEliminar.value) return;
  
  const index = materias.value.findIndex(m => m.id === materiaAEliminar.value?.id);
  if (index !== -1) {
    materias.value.splice(index, 1);
    showNotification('Materia eliminada correctamente', 'success');
  }
  
  cancelarEliminar();
};

const verDetalleProfesores = (materia: Materia) => {
  materiaSeleccionada.value = materia;
  showProfesoresModal.value = true;
};

const cerrarDetalleProfesores = () => {
  materiaSeleccionada.value = null;
  showProfesoresModal.value = false;
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
@import '@/assets/styles/dashboards/direccion/horarios.css';

/* Estilos adicionales específicos para este componente */
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

/* Tabla de materias */
.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 32px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
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
  width: 40%;
}

.col-profesores {
  width: 30%;
}

.col-acciones {
  width: 30%;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
}

.materia-nombre {
  font-weight: 500;
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

.btn-accion:hover {
  opacity: 0.9;
}

.btn-accion svg {
  font-size: 14px;
}

/* Contador con acción */
.count-with-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.count {
  font-weight: 600;
  background-color: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.warning-text {
  color: #b91c1c;
  font-size: 13px;
  display: block;
  margin-top: 8px;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #dc2626;
}

/* Lista de profesores */
.profesores-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profesor-item {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.profesor-item:last-child {
  border-bottom: none;
}

.profesor-info {
  display: flex;
  flex-direction: column;
}

.profesor-nombre {
  font-weight: 500;
  color: #111827;
}

.profesor-email {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
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
  
  .count-with-action {
    flex-direction: column;
    align-items: center;
    gap: 8px;
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
  
  .table-container {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 500px;
  }
}
</style>
