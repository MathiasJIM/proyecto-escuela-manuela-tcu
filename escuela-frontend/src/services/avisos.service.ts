import api from './api'

export type TipoDestinatario = 'todos' | 'profesores' | 'padres'

export interface Aviso {
  id_aviso: string
  titulo: string
  contenido: string
  fecha_envio: string
  destinatario: TipoDestinatario
}

export interface AvisoCreate {
  titulo: string
  contenido: string
  fecha_envio: string
  destinatario: TipoDestinatario
}

class AvisosService {
  async obtenerAvisos() {
    const response = await api.get<Aviso[]>('/avisos/obtener-avisos')
    return response.data
  }

  async crearAviso(aviso: AvisoCreate) {
    const response = await api.post<Aviso>('/avisos/crear-aviso', aviso)
    return response.data
  }

  async actualizarAviso(aviso: Aviso) {
    const response = await api.put<Aviso>(`/avisos/actualizar-aviso/${aviso.id_aviso}`, aviso)
    return response.data
  }

  async eliminarAviso(id: string) {
    await api.delete(`/avisos/eliminar-aviso/${id}`)
  }
}

export const avisosService = new AvisosService()
