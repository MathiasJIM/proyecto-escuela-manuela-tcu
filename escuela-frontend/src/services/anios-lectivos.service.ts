import api from './api';

// Interfaces
export interface AnioLectivo {
  id_anio: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface AnioLectivoCreate {
  nombre: string;
  fecha_inicio: string; // Formato YYYY-MM-DD
  fecha_fin: string; // Formato YYYY-MM-DD
  activo: boolean;
}

export interface AnioLectivoUpdate {
  nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  activo?: boolean;
}

const AniosLectivosService = {
  async obtenerAniosLectivos(): Promise<AnioLectivo[]> {
    try {
      // Usar axios directamente con la URL completa para evitar problemas con la configuración de api
      const response = await api.get<AnioLectivo[]>('/anios-lectivos/obtener-anios-lectivos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener años lectivos:', error);
      throw error;
    }
  },

  async obtenerAnioLectivo(id: string): Promise<AnioLectivo> {
    try {
      const response = await api.get<AnioLectivo>(`/anios-lectivos/obtener-anio-lectivo/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener año lectivo con ID ${id}:`, error);
      throw error;
    }
  },

  async obtenerAnioLectivoActivo(): Promise<AnioLectivo> {
    try {
      const response = await api.get<AnioLectivo>(`/anios-lectivos/obtener-anio-lectivo-activo`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener año lectivo activo:', error);
      throw error;
    }
  },

  async crearAnioLectivo(anioLectivo: AnioLectivoCreate): Promise<AnioLectivo> {
    try {
      // Crear un objeto literal exactamente como lo espera el backend
      const payload = {
        nombre: anioLectivo.nombre,
        fecha_inicio: anioLectivo.fecha_inicio,
        fecha_fin: anioLectivo.fecha_fin,
        activo: anioLectivo.activo
      };
      
      console.log('Enviando datos al backend:', JSON.stringify(payload));
      const response = await api.post<AnioLectivo>('/anios-lectivos/crear-anio-lectivo', payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear año lectivo:', error);
      throw error;
    }
  },

  async actualizarAnioLectivo(id: string, anioLectivo: AnioLectivoUpdate): Promise<AnioLectivo> {
    try {
      // Asegurarse de que las fechas se envíen en formato ISO (YYYY-MM-DD)
      const formattedData = {
        ...anioLectivo,
        fecha_inicio: anioLectivo.fecha_inicio,
        fecha_fin: anioLectivo.fecha_fin
      };
      
      const response = await api.put<AnioLectivo>(`/anios-lectivos/actualizar-anio-lectivo/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar año lectivo con ID ${id}:`, error);
      throw error;
    }
  },

  async eliminarAnioLectivo(id: string): Promise<void> {
    try {
      await api.delete(`/anios-lectivos/eliminar-anio-lectivo/${id}`);
    } catch (error) {
      console.error(`Error al eliminar año lectivo con ID ${id}:`, error);
      throw error;
    }
  }
};

export default AniosLectivosService;
