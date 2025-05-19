import api from './api'

interface LoginRequest {
  correo: string
  contrasena: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  id_usuario: number
  nombre: string
  correo: string
  rol: string
}

interface User {
  id_usuario: number
  nombre: string
  correo: string
  rol: string
}

const AuthService = {
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials)

      if (
        !response.data.access_token ||
        !response.data.id_usuario ||
        !response.data.nombre ||
        !response.data.correo ||
        !response.data.rol
      ) {
        console.error('AuthService: Respuesta del backend incompleta:', response.data)
        throw new Error('Respuesta del servidor incompleta')
      }

      localStorage.setItem('token', response.data.access_token)

      const user: User = {
        id_usuario: response.data.id_usuario,
        nombre: response.data.nombre,
        correo: response.data.correo,
        rol: response.data.rol,
      }

      localStorage.setItem('user', JSON.stringify(user))

      return user
    } catch (error) {
      console.error('AuthService: Error en login:', error)
      throw error
    }
  },

  // Cerrar sesión
  logout(): void {
    // Llamar al endpoint de logout si existe
    api.post('/auth/logout').catch((error) => console.error('Error al cerrar sesión:', error))

    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Obtener el usuario actual desde localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  },
}

export default AuthService
