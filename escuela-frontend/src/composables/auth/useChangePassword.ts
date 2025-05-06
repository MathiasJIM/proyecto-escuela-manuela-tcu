import { ref } from 'vue'

// Definición de interfaces para mejorar el tipado
interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Message {
  type: 'success' | 'error'
  text: string
}

export function useChangePassword() {
  // Estado para el formulario de cambio de contraseña
  const passwordForm = ref<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const showCurrentPassword = ref<boolean>(false)
  const showNewPassword = ref<boolean>(false)
  const showConfirmPassword = ref<boolean>(false)
  const isPasswordLoading = ref<boolean>(false)
  const errors = ref<FormErrors>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const passwordMessage = ref<Message | null>(null)

  // Funciones para mostrar/ocultar contraseñas
  const toggleCurrentPassword = (): void => {
    showCurrentPassword.value = !showCurrentPassword.value
  }

  const toggleNewPassword = (): void => {
    showNewPassword.value = !showNewPassword.value
  }

  const toggleConfirmPassword = (): void => {
    showConfirmPassword.value = !showConfirmPassword.value
  }

  // Validación y actualización de contraseña
  const actualizarPassword = (): void => {
    // Resetear errores
    errors.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    // Validaciones básicas
    let isValid = true

    if (!passwordForm.value.currentPassword) {
      errors.value.currentPassword = 'La contraseña actual es requerida'
      isValid = false
    }

    if (!passwordForm.value.newPassword) {
      errors.value.newPassword = 'La nueva contraseña es requerida'
      isValid = false
    } else if (passwordForm.value.newPassword.length < 8) {
      errors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres'
      isValid = false
    } else if (!/[A-Z]/.test(passwordForm.value.newPassword)) {
      errors.value.newPassword = 'La contraseña debe contener al menos una mayúscula'
      isValid = false
    } else if (!/[0-9]/.test(passwordForm.value.newPassword)) {
      errors.value.newPassword = 'La contraseña debe contener al menos un número'
      isValid = false
    }

    if (!passwordForm.value.confirmPassword) {
      errors.value.confirmPassword = 'Debe confirmar la nueva contraseña'
      isValid = false
    } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      errors.value.confirmPassword = 'Las contraseñas no coinciden'
      isValid = false
    }

    if (!isValid) return

    // Simulación de envío
    isPasswordLoading.value = true

    // Simulamos una petición al servidor
    setTimeout(() => {
      isPasswordLoading.value = false
      passwordMessage.value = {
        type: 'success',
        text: 'Contraseña actualizada correctamente',
      }

      // Limpiar formulario
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        passwordMessage.value = null
      }, 3000)
    }, 1500)
  }

  return {
    passwordForm,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    isPasswordLoading,
    errors,
    passwordMessage,
    toggleCurrentPassword,
    toggleNewPassword,
    toggleConfirmPassword,
    actualizarPassword
  }
}
