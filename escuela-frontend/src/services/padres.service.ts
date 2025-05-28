import api from './api'

// Interfaces
export interface Padre {
  id_usuario: string
  nombre: string
  correo: string
  activo: boolean
  foto?: string
  rol: string
}

export interface PadreWithHijos extends Padre {
  hijos: EstudianteHijo[]
}

export interface EstudianteHijo {
  id_estudiante: string
  nombre: string
}

export interface PadreCreate {
  nombre: string
  correo: string
  contrasena?: string
  activo?: boolean
  foto?: string
}

export interface PadreUpdate {
  nombre?: string
  correo?: string
  activo?: boolean
  foto?: string
}

export interface CambioContrasenaRequest {
  contrasena_actual: string
  nueva_contrasena: string
}

const PadresService = {
  async obtenerPadres(): Promise<PadreWithHijos[]> {
    try {
      const response = await api.get('/padres/obtener-padres')
      return response.data
    } catch (error) {
      console.error('Error al obtener padres:', error)
      throw error
    }
  },

  async obtenerPadre(id: string): Promise<PadreWithHijos> {
    try {
      const response = await api.get(`/padres/obtener-padre/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener padre con ID ${id}:`, error)
      throw error
    }
  },

  async crearPadre(padre: PadreCreate): Promise<Padre> {
    try {
      // Utilizamos el endpoint de usuarios para crear un padre
      const response = await api.post('/usuarios/crear-usuario', {
        ...padre,
        rol: 'padre',
      })
      return response.data.usuario
    } catch (error) {
      console.error('Error al crear padre:', error)
      throw error
    }
  },

  async actualizarPadre(id: string, padre: PadreUpdate): Promise<Padre> {
    try {
      const response = await api.put(`/padres/actualizar-padre/${id}`, padre)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar padre con ID ${id}:`, error)
      throw error
    }
  },

  async eliminarPadre(id: string): Promise<{ mensaje: string }> {
    try {
      const response = await api.delete(`/padres/eliminar-padre/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar padre con ID ${id}:`, error)
      throw error
    }
  },

  async cambiarContrasena(datos: CambioContrasenaRequest): Promise<{ mensaje: string }> {
    try {
      const response = await api.post('/padres/cambiar-contrasena', datos)
      return response.data
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      throw error
    }
  },

  async obtenerHijosPadre(): Promise<EstudianteHijo[]> {
    try {
      const response = await api.get('/padres/mis-hijos')
      return response.data
    } catch (error) {
      console.error('Error al obtener hijos del padre:', error)
      throw error
    }
  },

  async obtenerNotasEstudiante(idEstudiante: string, idAnio?: string): Promise<any[]> {
    try {
      let url = `/padres/notas-estudiante/${idEstudiante}`
      if (idAnio) {
        url += `?id_anio=${idAnio}`
      }
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error(`Error al obtener notas del estudiante ${idEstudiante}:`, error)
      throw error
    }
  },

  async obtenerAsistenciasEstudiante(idEstudiante: string, idAnio?: string): Promise<any[]> {
    try {
      let url = `/padres/asistencias-estudiante/${idEstudiante}`
      if (idAnio) {
        url += `?id_anio=${idAnio}`
      }
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error(`Error al obtener asistencias del estudiante ${idEstudiante}:`, error)
      throw error
    }
  },
}

export default PadresService
