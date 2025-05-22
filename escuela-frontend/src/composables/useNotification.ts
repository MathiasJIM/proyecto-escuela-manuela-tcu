import { ref } from 'vue'

interface Notification {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  id: number
}

export function useNotification() {
  const notifications = ref<Notification[]>([])
  let nextId = 0

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', timeout = 3000) => {
    const id = nextId++
    const notification = { message, type, id }
    notifications.value.push(notification)
    
    // Eliminar la notificación después del tiempo especificado
    setTimeout(() => {
      removeNotification(id)
    }, timeout)
    
    return id
  }

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications,
    showNotification,
    removeNotification
  }
}

// Singleton para usar en toda la aplicación
const { notifications, showNotification, removeNotification } = useNotification()
export { notifications, showNotification, removeNotification }
