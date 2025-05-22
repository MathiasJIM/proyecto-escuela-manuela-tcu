import api from './api';

// Interfaces
export interface Seccion {
  id_seccion: string;
  nombre: string;
  grado: string;
  id_profesor_guia: string | null;
  id_anio: string;
  profesor_guia_nombre?: string;
}

export interface SeccionCreate {
  nombre: string;
  grado: string;
  id_profesor_guia?: string | null;
  id_anio: string;
}

export interface SeccionUpdate {
  nombre?: string;
  grado?: string;
  id_profesor_guia?: string | null;
  id_anio?: string;
}

export interface Profesor {
  id_profesor: string;
  nombre: string;
  correo: string;
}

const SeccionesService = {
  async obtenerSecciones(): Promise<Seccion[]> {
    try {
      const response = await api.get<Seccion[]>('/secciones/obtener-secciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      throw error;
    }
  },

  async obtenerSeccionesPorAnio(idAnio: string): Promise<Seccion[]> {
    try {
      const response = await api.get<Seccion[]>(`/secciones/obtener-secciones-por-anio/${idAnio}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener secciones del año ${idAnio}:`, error);
      throw error;
    }
  },

  async obtenerSeccion(id: string): Promise<Seccion> {
    try {
      const response = await api.get<Seccion>(`/secciones/obtener-seccion/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener sección con ID ${id}:`, error);
      throw error;
    }
  },

  async crearSeccion(seccion: SeccionCreate): Promise<Seccion> {
    try {
      const response = await api.post<Seccion>('/secciones/crear-seccion', seccion);
      return response.data;
    } catch (error) {
      console.error('Error al crear sección:', error);
      throw error;
    }
  },

  async actualizarSeccion(id: string, seccion: SeccionUpdate): Promise<Seccion> {
    try {
      const response = await api.put<Seccion>(`/secciones/actualizar-seccion/${id}`, seccion);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar sección con ID ${id}:`, error);
      throw error;
    }
  },

  async eliminarSeccion(id: string): Promise<void> {
    try {
      await api.delete(`/secciones/eliminar-seccion/${id}`);
    } catch (error) {
      console.error(`Error al eliminar sección con ID ${id}:`, error);
      throw error;
    }
  },

  async obtenerProfesoresSeccion(id: string): Promise<Profesor[]> {
    try {
      const response = await api.get<Profesor[]>(`/secciones/obtener-profesores-seccion/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener profesores de la sección con ID ${id}:`, error);
      throw error;
    }
  }
};

export default SeccionesService;
