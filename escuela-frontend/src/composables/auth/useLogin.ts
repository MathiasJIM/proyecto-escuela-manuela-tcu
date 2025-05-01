import { ref, reactive } from 'vue'
// Router will be used later for redirections
// import { useRouter } from 'vue-router'

export function useLogin() {
  // const router = useRouter()

  // Estado del formulario
  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const showPassword = ref(false)
  const isLoading = ref(false)
  const errors = reactive({
    email: '',
    password: ''
  })

  // Función para mostrar/ocultar contraseña
  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  // Función para validar el formulario
  function validateForm() {
    let isValid = true
    
    // Validar email
    if (!email.value) {
      errors.email = 'El correo electrónico es requerido'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      errors.email = 'El correo electrónico no es válido'
      isValid = false
    } else {
      errors.email = ''
    }
    
    // Validar contraseña
    if (!password.value) {
      errors.password = 'La contraseña es requerida'
      isValid = false
    } else if (password.value.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
      isValid = false
    } else {
      errors.password = ''
    }
    
    return isValid
  }

  // Función para manejar el inicio de sesión
  async function handleLogin() {
    if (!validateForm()) return
    
    isLoading.value = true
    
    try {
      // Aquí iría la lógica de autenticación
      console.log('Iniciando sesión con:', { email: email.value, password: password.value, rememberMe: rememberMe.value })
      
      // Simulamos una respuesta del servidor
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirigir al usuario después del inicio de sesión exitoso
      // Implementar redirección cuando tengamos la ruta del dashboard
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
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
    togglePassword,
    handleLogin
  }
}