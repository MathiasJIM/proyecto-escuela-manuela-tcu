import api from './api'

// Interfaces
export interface Documento {
  id_documento: string;
  titulo: string;
  descripcion?: string;
  tipo: 'planeamiento' | 'circular' | 'material' | 'informe' | 'otro';
  archivo: string;
  fecha_subida: string;
  subido_por?: string;
  destinatario: 'direccion' | 'profesores' | 'padres' | 'todos';
}

export interface DocumentoCreate {
  titulo: string;
  descripcion?: string;
  tipo: 'planeamiento' | 'circular' | 'material' | 'informe' | 'otro';
  archivo: string;
  destinatario: 'direccion' | 'profesores' | 'padres' | 'todos';
}

export interface DocumentoUpdate {
  titulo?: string;
  descripcion?: string;
  tipo?: 'planeamiento' | 'circular' | 'material' | 'informe' | 'otro';
  archivo?: string;
  destinatario?: 'direccion' | 'profesores' | 'padres' | 'todos';
}

// Servicio
export const documentosService = {
  // Obtener todos los documentos
  async obtenerDocumentos(): Promise<Documento[]> {
    const token = localStorage.getItem('token');
    const response = await api.get<Documento[]>('/documentos/todos-documentos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Obtener un documento por ID
  async obtenerDocumento(id: string): Promise<Documento> {
    const token = localStorage.getItem('token');
    const response = await api.get<Documento>(`/documentos/obtener-documento/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Crear un nuevo documento con enlace
  async crearDocumento(documento: DocumentoCreate): Promise<Documento> {
    const token = localStorage.getItem('token');
    const response = await api.post<Documento>(`/documentos/subir-documento`, documento, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Actualizar un documento
  async actualizarDocumento(id: string, documento: DocumentoUpdate): Promise<Documento> {
    const token = localStorage.getItem('token');
    const response = await api.put<Documento>(`/documentos/actualizar-documento/${id}`, documento, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Eliminar un documento
  async eliminarDocumento(id: string): Promise<Documento> {
    const token = localStorage.getItem('token');
    const response = await api.delete<Documento>(`/documentos/eliminar-documento/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
