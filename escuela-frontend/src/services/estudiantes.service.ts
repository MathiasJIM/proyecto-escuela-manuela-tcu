import api from './api'

export interface Estudiante {
  id_estudiante: string
  nombre: string
  id_padre: string | null
  seccion?: {
    id_seccion: string
    nombre: string
    grado: string
  }
}

export interface EstudianteWithCredentials extends Estudiante {
  correo_padre: string
  contrasena_padre: string
  matriculado?: boolean
  id_seccion?: string
  id_anio?: string
}

export interface EstudianteCreate {
  nombre: string
  id_seccion?: string
  id_anio?: string
}

export interface EstudianteUpdate {
  nombre?: string
  id_seccion?: string
  id_anio?: string
}

const EstudiantesService = {
  // Obtener todos los estudiantes
  async obtenerEstudiantes() {
    const response = await api.get<Estudiante[]>('/estudiantes/obtener-estudiantes')
    return response.data
  },

  // Obtener un estudiante por ID
  async obtenerEstudiante(id: string) {
    const response = await api.get<Estudiante>(`/estudiantes/obtener-estudiante/${id}`)
    return response.data
  },

  // Crear un nuevo estudiante
  async crearEstudiante(estudiante: EstudianteCreate) {
    const response = await api.post<EstudianteWithCredentials>('/estudiantes/crear-estudiante', estudiante)
    return response.data
  },

  // Actualizar un estudiante
  async actualizarEstudiante(id: string, estudiante: EstudianteUpdate) {
    const response = await api.put<Estudiante>(`/estudiantes/actualizar-estudiante/${id}`, estudiante)
    return response.data
  },

  // Eliminar un estudiante
  async eliminarEstudiante(id: string) {
    await api.delete(`/estudiantes/eliminar-estudiante/${id}`)
  }
}

export default EstudiantesService
