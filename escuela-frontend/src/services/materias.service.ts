import api from './api';

// Interfaces
export interface Materia {
  id_materia: string;
  nombre: string;
}

export interface MateriaCreate {
  nombre: string;
}

export interface Profesor {
  id_profesor: string;
  nombre: string;
  correo: string;
}

const MateriasService = {
  async obtenerMaterias(): Promise<Materia[]> {
    try {
      const response = await api.get<Materia[]>('/materias/obtener-materias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener materias:', error);
      throw error;
    }
  },

  async obtenerMateria(id: string): Promise<Materia> {
    try {
      const response = await api.get<Materia>(`/materias/obtener-materia/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener materia con ID ${id}:`, error);
      throw error;
    }
  },

  async crearMateria(materia: MateriaCreate): Promise<Materia> {
    try {
      const response = await api.post<Materia>('/materias/crear-materia', materia);
      return response.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  },

  async actualizarMateria(id: string, materia: MateriaCreate): Promise<Materia> {
    try {
      const response = await api.put<Materia>(`/materias/actualizar-materia/${id}`, materia);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar materia con ID ${id}:`, error);
      throw error;
    }
  },

  async eliminarMateria(id: string): Promise<void> {
    try {
      await api.delete(`/materias/eliminar-materia/${id}`);
    } catch (error) {
      console.error(`Error al eliminar materia con ID ${id}:`, error);
      throw error;
    }
  },

  async obtenerProfesoresMateria(id: string): Promise<Profesor[]> {
    try {
      const response = await api.get<Profesor[]>(`/materias/obtener-profesores-materia/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener profesores de la materia con ID ${id}:`, error);
      throw error;
    }
  }
};

export default MateriasService;
