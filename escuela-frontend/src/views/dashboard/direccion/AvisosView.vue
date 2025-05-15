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
import useAvisos from '@/composables/dashboards/direccion/useAvisos';

const {
  // Estado
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
  closeNotification
} = useAvisos();
</script>

<style scoped>
@import '@/assets/styles/dashboards/direccion/avisos.css'
</style>
