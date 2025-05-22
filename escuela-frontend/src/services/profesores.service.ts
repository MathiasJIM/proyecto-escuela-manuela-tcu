import api from './api';

// Interfaces
export interface Profesor {
  id_profesor: string;
  nombre: string;
  correo: string;
}

export interface ProfesorCreate {
  nombre: string;
  correo: string;
}

export interface ProfesorCreated extends Profesor {
  password: string;
}

export interface Materia {
  id_materia: string;
  nombre: string;
  anio_nombre?: string;
}

export interface Seccion {
  id_seccion: string;
  nombre: string;
  grado: string;
  anio_nombre?: string;
}

export interface ProfesorCompleto {
  profesor: Profesor;
  materias: Materia[];
  secciones: Seccion[];
}

export interface ProfesorMateriasAsignacion {
  id_profesor: string;
  id_materias: string[];
  id_anio: string;
}

export interface ProfesorSeccionesAsignacion {
  id_profesor: string;
  id_secciones: string[];
}

const ProfesoresService = {
  async crearProfesor(profesor: ProfesorCreate): Promise<ProfesorCreated> {
    try {
      const response = await api.post<ProfesorCreated>('/profesores/crear-profesor', profesor);
      return response.data;
    } catch (error) {
      console.error('Error al crear profesor:', error);
      throw error;
    }
  },

  async obtenerProfesores(): Promise<Profesor[]> {
    try {
      const response = await api.get<Profesor[]>('/profesores/obtener-profesores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesores:', error);
      throw error;
    }
  },

  async obtenerProfesor(id: string): Promise<ProfesorCompleto> {
    try {
      const response = await api.get<ProfesorCompleto>(`/profesores/obtener-profesor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener profesor con ID ${id}:`, error);
      throw error;
    }
  },

  async obtenerMateriasProfesor(id: string, idAnio?: string): Promise<Materia[]> {
    try {
      let url = `/profesores/obtener-materias-profesor/${id}`;
      if (idAnio) {
        url += `?id_anio=${idAnio}`;
      }
      const response = await api.get<Materia[]>(url);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener materias del profesor con ID ${id}:`, error);
      throw error;
    }
  },

  async obtenerSeccionesProfesor(id: string): Promise<Seccion[]> {
    try {
      const response = await api.get<Seccion[]>(`/profesores/obtener-secciones-profesor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener secciones del profesor con ID ${id}:`, error);
      throw error;
    }
  },

  async actualizarProfesor(id: string, profesor: { nombre: string; correo: string }): Promise<Profesor> {
    try {
      const response = await api.put<Profesor>(`/profesores/actualizar-profesor/${id}`, profesor);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar profesor con ID ${id}:`, error);
      throw error;
    }
  },

  async eliminarProfesor(id: string): Promise<{ mensaje: string }> {
    try {
      const response = await api.delete<{ mensaje: string }>(`/profesores/eliminar-profesor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar profesor con ID ${id}:`, error);
      throw error;
    }
  },

  async asignarMaterias(asignacion: ProfesorMateriasAsignacion): Promise<void> {
    try {
      await api.post('/profesores/asignar-materias', asignacion);
    } catch (error) {
      console.error('Error al asignar materias al profesor:', error);
      throw error;
    }
  },

  async asignarSecciones(asignacion: ProfesorSeccionesAsignacion): Promise<void> {
    try {
      await api.post('/profesores/asignar-secciones', asignacion);
    } catch (error) {
      console.error('Error al asignar secciones al profesor:', error);
      throw error;
    }
  }
};

export default ProfesoresService;
