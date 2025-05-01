import { ref } from 'vue'
// Router will be used later for redirections
// import { useRouter } from 'vue-router'

export function useRegister() {
  // const router = useRouter()

  // Estado del formulario
  const fullName = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const isLoading = ref(false)

  // No se requiere información del estudiante por el momento

  // Variables para la validación de contraseña
  const passwordStrength = ref(0)
  const passwordStrengthText = ref('')
  const passwordStrengthPercentage = ref(0)
  const hasMinLength = ref(false)
  const hasUpperCase = ref(false)
  const hasLowerCase = ref(false)
  const hasNumber = ref(false)

  // Función para mostrar/ocultar contraseña
  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  // Función para mostrar/ocultar confirmación de contraseña
  function toggleConfirmPassword() {
    showConfirmPassword.value = !showConfirmPassword.value
  }

  // Función para verificar la fortaleza de la contraseña
  function checkPasswordStrength() {
    const pwd = password.value
    
    // Verificar requisitos
    hasMinLength.value = pwd.length >= 8
    hasUpperCase.value = /[A-Z]/.test(pwd)
    hasLowerCase.value = /[a-z]/.test(pwd)
    hasNumber.value = /[0-9]/.test(pwd)
    
    // Calcular puntuación
    let score = 0
    if (hasMinLength.value) score += 1
    if (hasUpperCase.value) score += 1
    if (hasLowerCase.value) score += 1
    if (hasNumber.value) score += 1
    
    // Asignar nivel de fortaleza
    passwordStrength.value = score
    
    // Textos según nivel
    const strengthTexts = ['Muy débil', 'Débil', 'Moderada', 'Fuerte']
    passwordStrengthText.value = strengthTexts[score - 1] || ''
    
    // Porcentaje para la barra de progreso
    passwordStrengthPercentage.value = (score / 4) * 100
  }

  // Función para manejar el registro
  async function handleRegister() {
    // Validar que las contraseñas coincidan
    if (password.value !== confirmPassword.value) {
      return
    }
    
    // Validar fortaleza de contraseña
    if (passwordStrength.value < 3) {
      return
    }
    
    isLoading.value = true
    
    try {
      // Aquí iría la lógica de registro
      console.log('Registrando padre/madre:', { 
        fullName: fullName.value,
        email: email.value,
        password: password.value
      })
      
      // Simulamos una respuesta del servidor
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirigir al usuario después del registro exitoso
      // Implementar redirección cuando tengamos la ruta del dashboard
      
    } catch (error) {
      console.error('Error al registrar usuario:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    fullName,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    passwordStrength,
    passwordStrengthText,
    passwordStrengthPercentage,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    togglePassword,
    toggleConfirmPassword,
    checkPasswordStrength,
    handleRegister
  }
}