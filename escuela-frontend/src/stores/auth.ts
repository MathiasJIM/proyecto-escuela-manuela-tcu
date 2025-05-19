import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(AuthService.getCurrentUser())
  const isAuthenticated = ref(AuthService.isAuthenticated())

  const userRole = computed(() => user.value?.rol || null)
  const userName = computed(() => user.value?.nombre || '')
  const userId = computed(() => user.value?.id_usuario || null)

  function setUser(userData: any) {
    user.value = userData
    isAuthenticated.value = true
  }

  function clearUser() {
    user.value = null
    isAuthenticated.value = false
  }

  async function logout() {
    await AuthService.logout()
    clearUser()
  }

  function hasRole(role: string): boolean {
    return user.value?.rol === role
  }

  const isDireccion = computed(() => hasRole('direccion'))
  const isProfesor = computed(() => hasRole('profesor'))
  const isPadre = computed(() => hasRole('padre'))

  return {
    user,
    isAuthenticated,
    userRole,
    userName,
    userId,
    isDireccion,
    isProfesor,
    isPadre,
    setUser,
    clearUser,
    logout,
    hasRole
  }
})
