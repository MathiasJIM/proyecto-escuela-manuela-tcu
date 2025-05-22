import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AniosLectivosService from '@/services/anios-lectivos.service';
import type { 
  AnioLectivo, 
  AnioLectivoCreate, 
  AnioLectivoUpdate 
} from '@/services/anios-lectivos.service';

// Interfaces
interface Notificacion {
  mostrar: boolean;
  titulo: string;
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

export function useAniosLectivos() {
  const router = useRouter();
  
  // Estado
  const aniosLectivos = ref<AnioLectivo[]>([]);
  const anioLectivoActivo = ref<AnioLectivo | null>(null);
  const anioSeleccionado = ref<AnioLectivo | null>(null);
  const cargando = ref<boolean>(false);
  const error = ref<string>('');
  const busqueda = ref<string>('');
  const showConfirmModal = ref<boolean>(false);
  const anioAEliminar = ref<AnioLectivo | null>(null);
  const notificacion = ref<Notificacion>({
    mostrar: false,
    titulo: '',
    mensaje: '',
    tipo: 'info',
    timeout: 5000
  });

  // Computed
  const aniosFiltrados = computed(() => {
    if (!busqueda.value) return aniosLectivos.value;
    
    const termino = busqueda.value.toLowerCase();
    return aniosLectivos.value.filter(anio => 
      anio.nombre.toLowerCase().includes(termino)
    );
  });

  // Métodos
  const cargarAniosLectivos = async () => {
    cargando.value = true;
    error.value = '';
    
    try {
      aniosLectivos.value = await AniosLectivosService.obtenerAniosLectivos();
      
      // Identificar el año lectivo activo
      const anioActivo = aniosLectivos.value.find(anio => anio.activo);
      if (anioActivo) {
        anioLectivoActivo.value = anioActivo;
      }
    } catch (err: any) {
      console.error('Error al cargar años lectivos:', err);
      error.value = 'No se pudieron cargar los años lectivos. Intente nuevamente.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        error.value = err.response.data.detail;
      }
    } finally {
      cargando.value = false;
    }
  };

  const obtenerAnioLectivo = async (id: string) => {
    cargando.value = true;
    error.value = '';
    
    try {
      const anio = await AniosLectivosService.obtenerAnioLectivo(id);
      anioSeleccionado.value = anio;
      return anio;
    } catch (err: any) {
      console.error(`Error al obtener año lectivo ${id}:`, err);
      error.value = 'No se pudo obtener el año lectivo. Intente nuevamente.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        error.value = err.response.data.detail;
      }
      return null;
    } finally {
      cargando.value = false;
    }
  };

  const crearAnioLectivo = async (anioLectivo: AnioLectivoCreate) => {
    cargando.value = true;
    error.value = '';
    
    try {
      const nuevoAnio = await AniosLectivosService.crearAnioLectivo(anioLectivo);
      
      // Actualizar la lista local
      aniosLectivos.value.push(nuevoAnio);
      
      // Si el nuevo año es activo, actualizar el año activo
      if (nuevoAnio.activo) {
        anioLectivoActivo.value = nuevoAnio;
        // Desactivar el año activo anterior en la lista local
        aniosLectivos.value.forEach(anio => {
          if (anio.id_anio !== nuevoAnio.id_anio) {
            anio.activo = false;
          }
        });
      }
      
      mostrarNotificacion(
        'Año lectivo creado',
        `El año lectivo ${nuevoAnio.nombre} ha sido creado correctamente.`,
        'success'
      );
      
      return nuevoAnio;
    } catch (err: any) {
      console.error('Error al crear año lectivo:', err);
      let mensajeError = 'No se pudo crear el año lectivo. Intente nuevamente.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail;
      }
      
      mostrarNotificacion(
        'Error',
        mensajeError,
        'error'
      );
      
      return null;
    } finally {
      cargando.value = false;
    }
  };

  const actualizarAnioLectivo = async (id: string, anioLectivo: AnioLectivoUpdate) => {
    cargando.value = true;
    error.value = '';
    
    try {
      const anioActualizado = await AniosLectivosService.actualizarAnioLectivo(id, anioLectivo);
      
      // Actualizar en la lista local
      const index = aniosLectivos.value.findIndex(anio => anio.id_anio === id);
      if (index !== -1) {
        aniosLectivos.value[index] = anioActualizado;
      }
      
      // Si se activó este año, actualizar el año activo
      if (anioActualizado.activo) {
        anioLectivoActivo.value = anioActualizado;
        // Desactivar otros años en la lista local
        aniosLectivos.value.forEach(anio => {
          if (anio.id_anio !== id) {
            anio.activo = false;
          }
        });
      } else if (anioLectivoActivo.value && anioLectivoActivo.value.id_anio === id) {
        // Si se desactivó el año que estaba activo
        anioLectivoActivo.value = null;
      }
      
      mostrarNotificacion(
        'Año lectivo actualizado',
        `El año lectivo ${anioActualizado.nombre} ha sido actualizado correctamente.`,
        'success'
      );
      
      return anioActualizado;
    } catch (err: any) {
      console.error(`Error al actualizar año lectivo ${id}:`, err);
      let mensajeError = 'No se pudo actualizar el año lectivo. Intente nuevamente.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail;
      }
      
      mostrarNotificacion(
        'Error',
        mensajeError,
        'error'
      );
      
      return null;
    } finally {
      cargando.value = false;
    }
  };

  const confirmarEliminarAnio = (anio: AnioLectivo) => {
    anioAEliminar.value = anio;
    showConfirmModal.value = true;
  };

  const cancelarEliminarAnio = () => {
    anioAEliminar.value = null;
    showConfirmModal.value = false;
  };

  const eliminarAnioLectivo = async () => {
    if (!anioAEliminar.value) return;
    
    const anioId = anioAEliminar.value.id_anio;
    const anioNombre = anioAEliminar.value.nombre;
    
    cargando.value = true;
    error.value = '';
    
    try {
      await AniosLectivosService.eliminarAnioLectivo(anioId);
      
      // Eliminar de la lista local
      aniosLectivos.value = aniosLectivos.value.filter(anio => anio.id_anio !== anioId);
      
      // Si era el año activo, actualizar el estado
      if (anioLectivoActivo.value && anioLectivoActivo.value.id_anio === anioId) {
        anioLectivoActivo.value = null;
      }
      
      mostrarNotificacion(
        'Año lectivo eliminado',
        `El año lectivo ${anioNombre} ha sido eliminado correctamente.`,
        'success'
      );
      
      cancelarEliminarAnio();
    } catch (err: any) {
      console.error(`Error al eliminar año lectivo ${anioId}:`, err);
      let mensajeError = 'No se pudo eliminar el año lectivo. Intente nuevamente.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        mensajeError = err.response.data.detail;
      }
      
      mostrarNotificacion(
        'Error',
        mensajeError,
        'error'
      );
    } finally {
      cargando.value = false;
    }
  };

  const cambiarEstadoAnio = async (anio: AnioLectivo, activar: boolean) => {
    return actualizarAnioLectivo(anio.id_anio, { activo: activar });
  };

  const mostrarNotificacion = (titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    notificacion.value = {
      mostrar: true,
      titulo,
      mensaje,
      tipo,
      timeout: 5000
    };
    
    // Auto-cerrar después del timeout
    setTimeout(() => {
      cerrarNotificacion();
    }, notificacion.value.timeout);
  };

  const cerrarNotificacion = () => {
    notificacion.value.mostrar = false;
  };

  // Cargar años lectivos al montar el componente
  onMounted(() => {
    cargarAniosLectivos();
  });

  return {
    // Estado
    aniosLectivos,
    anioLectivoActivo,
    anioSeleccionado,
    cargando,
    error,
    busqueda,
    showConfirmModal,
    anioAEliminar,
    notificacion,
    aniosFiltrados,
    
    // Métodos
    cargarAniosLectivos,
    obtenerAnioLectivo,
    crearAnioLectivo,
    actualizarAnioLectivo,
    confirmarEliminarAnio,
    cancelarEliminarAnio,
    eliminarAnioLectivo,
    cambiarEstadoAnio,
    mostrarNotificacion,
    cerrarNotificacion
  };
}
