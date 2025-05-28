import api from './api'

export interface Estudiante {
  id_estudiante: string
  cedula: string
  nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_padre: string | null
  id_seccion: string | null
  seccion?: {
    id_seccion: string
    nombre: string
    grado: string
  }
}

export interface EstudianteWithCredentials extends Omit<Estudiante, 'id_seccion'> {
  correo_padre: string
  contrasena_padre: string
  matriculado?: boolean
  id_seccion?: string | null
  id_anio?: string
}

export interface EstudianteCreate {
  cedula: string
  nombre: string
  primer_apellido: string
  segundo_apellido: string
  id_padre?: string
  id_seccion?: string
}

export interface EstudianteUpdate {
  cedula?: string
  nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
  id_padre?: string
  id_seccion?: string
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
