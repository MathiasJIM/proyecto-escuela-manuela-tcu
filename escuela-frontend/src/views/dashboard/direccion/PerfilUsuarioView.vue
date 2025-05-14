<template>
  <div class="perfil-container">
    <h1 class="perfil-titulo">Perfil de Usuario</h1>
    
    <div class="perfil-contenido">
      <!-- Sección de información del usuario con avatar -->
      <div class="perfil-header">
        <div class="avatar-container">
          <div class="avatar-iniciales">
            {{ obtenerIniciales(usuario.nombre) }}
          </div>
        </div>
        
        <div class="perfil-info-basica">
          <h2>{{ usuario.nombre }}</h2>
          <p class="perfil-rol">{{ usuario.rol }}</p>
          <div class="perfil-botones">
            <button class="btn-editar" @click="modoEdicion = true" v-if="!modoEdicion">
              <font-awesome-icon :icon="['fas', 'edit']" /> Editar perfil
            </button>
            <button class="btn-cerrar-sesion" @click="cerrarSesion">
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      
      <!-- Información personal -->
      <div class="perfil-panel">
        <h3 class="panel-titulo">Información personal</h3>
        
        <!-- Modo visualización -->
        <div class="panel-contenido" v-if="!modoEdicion">
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre completo:</label>
              <p>{{ usuario.nombre }}</p>
            </div>
            <div class="info-item">
              <label>Correo electrónico:</label>
              <p>{{ usuario.correo }}</p>
            </div>
            <div class="info-item">
              <label>Rol:</label>
              <p>{{ usuario.rol }}</p>
            </div>
            <div class="info-item">
              <label>Teléfono:</label>
              <p>{{ usuario.telefono || 'No especificado' }}</p>
            </div>
            <div class="info-item">
              <label>Fecha de registro:</label>
              <p>{{ formatearFecha(usuario.fechaRegistro) }}</p>
            </div>
            <div class="info-item">
              <label>Último acceso:</label>
              <p>{{ formatearFecha(usuario.ultimoAcceso) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Modo edición -->
        <div class="panel-contenido" v-if="modoEdicion">
          <form @submit.prevent="guardarCambios" class="form-edicion">
            <div class="form-grid">
              <div class="form-grupo">
                <label for="nombre">Nombre completo:</label>
                <input type="text" id="nombre" v-model="usuarioEditado.nombre" required>
              </div>
              
              <div class="form-grupo">
                <label for="correo">Correo electrónico:</label>
                <input type="email" id="correo" v-model="usuario.correo" disabled>
                <small>El correo electrónico no se puede modificar</small>
              </div>
              
              <div class="form-grupo">
                <label for="rol">Rol:</label>
                <input type="text" id="rol" v-model="usuario.rol" disabled>
                <small>El rol no se puede modificar</small>
              </div>
              
              <div class="form-grupo">
                <label for="telefono">Teléfono:</label>
                <input type="tel" id="telefono" v-model="usuarioEditado.telefono">
              </div>
            </div>
            
            <div class="form-acciones">
              <button type="button" class="btn-cancelar" @click="cancelarEdicion">Cancelar</button>
              <button type="submit" class="btn-guardar">Guardar cambios</button>
              <router-link to="/cambiar-contrasena" class="btn-cambiar-password">
                <font-awesome-icon :icon="['fas', 'lock']" /> Cambiar contraseña
              </router-link>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Historial de acciones -->
      <div class="perfil-panel">
        <h3 class="panel-titulo">Historial de acciones recientes</h3>
        <div class="panel-contenido">
          <table class="tabla-historial">
            <thead>
              <tr>
                <th>Acción</th>
                <th>Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(accion, index) in historialAcciones" :key="index">
                <td>{{ accion.descripcion }}</td>
                <td class="fecha-hora">{{ formatearFechaHora(accion.fecha) }}</td>
              </tr>
              <tr v-if="historialAcciones.length === 0">
                <td colspan="2" class="sin-datos">No hay acciones recientes para mostrar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado del usuario
interface Usuario {
  nombre: string;
  correo: string;
  rol: string;
  telefono: string;
  fechaRegistro: Date;
  ultimoAcceso: Date;
}

interface Accion {
  descripcion: string;
  fecha: Date;
}

// Datos del usuario (simulados)
const usuario = reactive<Usuario>({
  nombre: 'María Fernández Rojas',
  correo: 'maria.fernandez@escuela.edu',
  rol: 'Administrador',
  telefono: '8888-1234',
  fechaRegistro: new Date(2024, 0, 15),
  ultimoAcceso: new Date(2025, 4, 8, 10, 30)
});

// Copia para edición
const usuarioEditado = reactive({
  nombre: usuario.nombre,
  telefono: usuario.telefono
});

// Estado para modo edición
const modoEdicion = ref(false);

// Historial de acciones (simulado)
const historialAcciones = ref<Accion[]>([
  {
    descripcion: 'Creó una nueva sección: 3-A',
    fecha: new Date(2025, 4, 8, 9, 15)
  },
  {
    descripcion: 'Editó información del profesor Carlos Ramírez',
    fecha: new Date(2025, 4, 7, 14, 30)
  },
  {
    descripcion: 'Publicó un nuevo aviso: Reunión de padres',
    fecha: new Date(2025, 4, 6, 11, 45)
  },
  {
    descripcion: 'Actualizó el horario del grupo 5-B',
    fecha: new Date(2025, 4, 5, 10, 20)
  },
  {
    descripcion: 'Generó reporte de asistencia mensual',
    fecha: new Date(2025, 4, 4, 16, 10)
  }
]);

// Métodos
const obtenerIniciales = (nombre: string): string => {
  return nombre
    .split(' ')
    .map(parte => parte.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const formatearFecha = (fecha: Date): string => {
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatearFechaHora = (fecha: Date): string => {
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' ' + fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const guardarCambios = () => {
  // En un entorno real, aquí se enviarían los datos al servidor
  usuario.nombre = usuarioEditado.nombre;
  usuario.telefono = usuarioEditado.telefono;
  modoEdicion.value = false;
  
  // Simulación de una nueva acción en el historial
  historialAcciones.value.unshift({
    descripcion: 'Actualizó su información de perfil',
    fecha: new Date()
  });
};

const cancelarEdicion = () => {
  // Restaurar valores originales
  usuarioEditado.nombre = usuario.nombre;
  usuarioEditado.telefono = usuario.telefono;
  modoEdicion.value = false;
};

const cerrarSesion = () => {
  // En un entorno real, aquí se cerraría la sesión
  router.push('/login');
};

// Inicialización
onMounted(() => {
  // En un entorno real, aquí se cargarían los datos del usuario desde la API
});
</script>

<style scoped>
/* Estilos generales */
.perfil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
}

.perfil-titulo {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.perfil-contenido {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Paneles */
.perfil-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-titulo {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.panel-contenido {
  padding: 20px;
}

/* Cabecera del perfil con avatar */
.perfil-header {
  display: flex;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  width: 80px;
  height: 80px;
  margin-right: 24px;
  flex-shrink: 0;
}

.avatar-iniciales {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
}

.perfil-info-basica {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.perfil-info-basica h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.perfil-rol {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.perfil-botones {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

/* Grids de información */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-weight: 500;
  color: #64748b;
  font-size: 14px;
}

.info-item p {
  margin: 0;
  color: #1e293b;
  font-size: 16px;
}

/* Formulario */
.form-edicion {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-grupo {
  margin-bottom: 16px;
}

.form-grupo label {
  display: block;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-grupo input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.form-grupo input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.form-grupo input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

.form-grupo small {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.form-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

/* Botones */
.btn-editar, .btn-guardar, .btn-cancelar, .btn-cerrar-sesion, .btn-cambiar-password {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-editar {
  background-color: #f1f5f9;
  color: #1e293b;
  border: 1px solid #cbd5e1;
}

.btn-editar:hover {
  background-color: #e2e8f0;
}

.btn-guardar {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.btn-guardar:hover {
  background-color: #4338ca;
}

.btn-guardar:disabled {
  background-color: #c7d2fe;
  cursor: not-allowed;
}

.btn-cancelar {
  background-color: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.btn-cancelar:hover {
  background-color: #f1f5f9;
}

.btn-cerrar-sesion {
  background-color: white;
  color: #ef4444;
  border: 1px solid #fecaca;
  margin-left: auto;
}

.btn-cerrar-sesion:hover {
  background-color: #fef2f2;
}

.btn-cambiar-password {
  background-color: #f1f5f9;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  text-decoration: none;
  margin-left: 12px;
}

.btn-cambiar-password:hover {
  background-color: #e2e8f0;
}

/* Tabla de historial */
.tabla-historial {
  width: 100%;
  border-collapse: collapse;
}

.tabla-historial th, .tabla-historial td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-historial th {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.tabla-historial td {
  color: #334155;
}

.fecha-hora {
  color: #64748b;
  font-size: 14px;
  white-space: nowrap;
}

.tabla-historial tr:last-child td {
  border-bottom: none;
}

.sin-datos {
  text-align: center;
  color: #64748b;
  padding: 24px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .perfil-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .perfil-botones {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-cerrar-sesion {
    margin: 8px 0 0 0;
  }
  
  .info-grid, .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .perfil-container {
    padding: 16px;
  }
  
  .form-acciones {
    flex-direction: column;
  }
  
  .form-acciones button, .form-acciones a {
    width: 100%;
    margin: 0 0 8px 0;
  }
}
</style>
