import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth'

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const showPassword = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const errors = reactive({
    email: '',
    password: '',
  })
  
  // Verificar si hay un mensaje de error almacenado en sessionStorage al cargar la página
  onMounted(() => {
    const storedError = sessionStorage.getItem('loginError')
    if (storedError) {
      errorMessage.value = storedError
      sessionStorage.removeItem('loginError') // Limpiar después de mostrar
    }
  })

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  function validateForm() {
    let isValid = true
    // Resetear errores
    errors.email = ''
    errors.password = ''
    errorMessage.value = ''

    if (!email.value) {
      errors.email = 'El correo electrónico es requerido'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errors.email = 'El correo electrónico no es válido'
      isValid = false
    }

    if (!password.value) {
      errors.password = 'La contraseña es requerida'
      isValid = false
    } else if (password.value.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
      isValid = false
    }

    return isValid
  }

  async function handleLogin(e: Event) {
    // Prevenir el comportamiento predeterminado del formulario
    e.preventDefault()
    
    // No continuar si el formulario no es válido
    if (!validateForm()) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const user = await AuthService.login({
        correo: email.value,
        contrasena: password.value,
      })

      authStore.setUser(user)

      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      if (user.rol === 'direccion') {
        router.push('/dashboard/direccion/inicio')
      } else if (user.rol === 'profesor') {
        router.push('/dashboard/profesores/inicio')
      } else if (user.rol === 'padre') {
        router.push('/dashboard/padres/inicio')
      } else {
        errorMessage.value = 'Rol de usuario no reconocido'
      }
    } catch (error: any) {
      let mensaje = ''
      
      if (error.response) {
        if (error.response.status === 401) {
          mensaje = 'Credenciales incorrectas. Por favor, verifique su correo y contraseña.'
        } else {
          mensaje = `Error del servidor: ${error.response.status}`
        }
      } else if (error.request) {
        mensaje = 'No se pudo conectar con el servidor. Verifique su conexión a internet.'
      } else {
        mensaje = 'Error al procesar la solicitud. Inténtelo nuevamente.'
      }
      
      sessionStorage.setItem('loginError', mensaje)
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    rememberMe,
    showPassword,
    isLoading,
    errors,
    errorMessage,
    togglePassword,
    handleLogin,
  }
}
