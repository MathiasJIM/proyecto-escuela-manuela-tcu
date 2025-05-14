<template>
  <div class="container">
    <h1 class="title">Crear Nuevo Año Lectivo</h1>
    
    <div class="form-card">
      <form @submit.prevent="guardarNuevoAnio">
        <div class="form-group">
          <label for="anio" class="form-label">Año Lectivo *</label>
          <input 
            type="number" 
            id="anio" 
            v-model="formData.anio" 
            class="form-input" 
            :class="{ 'error': errors.anio }"
            placeholder="Ej: 2025"
            min="2000"
            max="2100"
            required
          />
          <div v-if="errors.anio" class="form-error">{{ errors.anio }}</div>
          <div v-if="anioExistente" class="form-error">Este año lectivo ya existe en el sistema.</div>
        </div>

        <div class="form-group">
          <label for="fechaInicio" class="form-label">Fecha de Inicio *</label>
          <input 
            type="date" 
            id="fechaInicio" 
            v-model="formData.fechaInicio" 
            class="form-input" 
            :class="{ 'error': errors.fechaInicio }"
            required
          />
          <div v-if="errors.fechaInicio" class="form-error">{{ errors.fechaInicio }}</div>
          <div class="form-help">Seleccione la fecha en que inicia el año lectivo.</div>
        </div>

        <div class="form-group">
          <label for="fechaFin" class="form-label">Fecha de Finalización *</label>
          <input 
            type="date" 
            id="fechaFin" 
            v-model="formData.fechaFin" 
            class="form-input" 
            :class="{ 'error': errors.fechaFin }"
            required
          />
          <div v-if="errors.fechaFin" class="form-error">{{ errors.fechaFin }}</div>
          <div class="form-help">Seleccione la fecha en que finaliza el año lectivo.</div>
        </div>

        <div class="form-group">
          <div class="form-check">
            <input 
              type="checkbox" 
              id="activo" 
              v-model="formData.activo" 
              class="form-check-input"
            />
            <label for="activo" class="form-check-label">
              Establecer como año lectivo activo
            </label>
          </div>
          <div v-if="hayAnioActivo && formData.activo" class="form-warning">
            <strong>Advertencia:</strong> Ya existe un año lectivo marcado como activo ({{ anioActivoActual }}). 
            Si continúa, este será desactivado y el nuevo año será establecido como activo.
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            @click="volver" 
            class="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!formValido || guardando"
          >
            <font-awesome-icon v-if="guardando" :icon="['fas', 'spinner']" spin />
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Notificación de éxito o error -->
    <Teleport to="body">
      <div 
        v-if="notificacion.mostrar" 
        class="notification" 
        :class="notificacion.tipo"
      >
        <font-awesome-icon 
          :icon="notificacionIcon" 
          class="notification-icon" 
        />
        <div class="notification-content">
          <div class="notification-title">{{ notificacion.titulo }}</div>
          <div class="notification-message">{{ notificacion.mensaje }}</div>
        </div>
        <button @click="cerrarNotificacion" class="notification-close">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faSpinner, 
  faTimes, 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons'
import useGestionAnios from '@/composables/dashboards/direccion/useGestionAnios'

// Registrar iconos
library.add(faSpinner, faTimes, faCheckCircle, faExclamationCircle, faInfoCircle)

const router = useRouter()
const { aniosLectivos } = useGestionAnios()

// Estado del formulario
const formData = reactive({
  anio: new Date().getFullYear() + 1, // Por defecto, el próximo año
  fechaInicio: '',
  fechaFin: '',
  activo: false
})

// Estado de errores
const errors = reactive({
  anio: '',
  fechaInicio: '',
  fechaFin: ''
})

// Estado de guardado
const guardando = ref(false)

// Verificar si ya existe un año con el mismo número
const anioExistente = computed(() => {
  return aniosLectivos.value.some(a => a.anio === formData.anio)
})

// Verificar si hay un año activo
const hayAnioActivo = computed(() => {
  return aniosLectivos.value.some(a => a.activo)
})

// Obtener el año activo actual
const anioActivoActual = computed(() => {
  const anioActivo = aniosLectivos.value.find(a => a.activo)
  return anioActivo ? anioActivo.anio : ''
})

// Validar el formulario
const validarFormulario = () => {
  let valido = true
  
  // Resetear errores
  errors.anio = ''
  errors.fechaInicio = ''
  errors.fechaFin = ''
  
  // Validar año
  if (!formData.anio) {
    errors.anio = 'El año es obligatorio'
    valido = false
  } else if (formData.anio < 2000 || formData.anio > 2100) {
    errors.anio = 'El año debe estar entre 2000 y 2100'
    valido = false
  } else if (anioExistente.value) {
    errors.anio = 'Este año ya existe en el sistema'
    valido = false
  }
  
  // Validar fecha de inicio
  if (!formData.fechaInicio) {
    errors.fechaInicio = 'La fecha de inicio es obligatoria'
    valido = false
  }
  
  // Validar fecha de fin
  if (!formData.fechaFin) {
    errors.fechaFin = 'La fecha de finalización es obligatoria'
    valido = false
  } else if (formData.fechaInicio && formData.fechaFin && new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
    errors.fechaFin = 'La fecha de finalización debe ser posterior a la fecha de inicio'
    valido = false
  }
  
  return valido
}

// Verificar si el formulario es válido
const formValido = computed(() => {
  return (
    formData.anio > 0 &&
    formData.fechaInicio !== '' &&
    formData.fechaFin !== '' &&
    new Date(formData.fechaInicio) < new Date(formData.fechaFin) &&
    !anioExistente.value
  )
})

// Estado de notificación
const notificacion = reactive({
  mostrar: false,
  tipo: 'success',
  titulo: '',
  mensaje: '',
  duracion: 5000 // 5 segundos
})

// Icono de notificación según el tipo
const notificacionIcon = computed(() => {
  switch (notificacion.tipo) {
    case 'success':
      return ['fas', 'check-circle']
    case 'error':
      return ['fas', 'exclamation-circle']
    default:
      return ['fas', 'info-circle']
  }
})

// Mostrar notificación
const mostrarNotificacion = (titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') => {
  notificacion.mostrar = true
  notificacion.tipo = tipo
  notificacion.titulo = titulo
  notificacion.mensaje = mensaje
  
  // Cerrar automáticamente después de la duración establecida
  setTimeout(() => {
    cerrarNotificacion()
  }, notificacion.duracion)
}

// Cerrar notificación
const cerrarNotificacion = () => {
  notificacion.mostrar = false
}

// Guardar nuevo año
const guardarNuevoAnio = async () => {
  if (!validarFormulario()) return
  
  guardando.value = true
  
  try {
    // Simulamos una operación asíncrona (en un entorno real, aquí iría la llamada a la API)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Si el nuevo año será activo, desactivamos los demás
    if (formData.activo) {
      aniosLectivos.value.forEach(anio => {
        anio.activo = false
      })
    }
    
    // Crear nuevo año
    const newId = Math.max(0, ...aniosLectivos.value.map(a => a.id)) + 1
    aniosLectivos.value.push({
      id: newId,
      anio: formData.anio,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      activo: formData.activo
    })
    
    mostrarNotificacion(
      'Año lectivo creado',
      `El año lectivo ${formData.anio} ha sido creado exitosamente.`,
      'success'
    )
    
    // Redirigir después de un breve retraso
    setTimeout(() => {
      router.push({ name: 'direccion-anios-ver' })
    }, 2000)
  } catch {
    mostrarNotificacion(
      'Error',
      'Ocurrió un error al crear el año lectivo. Por favor, inténtelo de nuevo.',
      'error'
    )
  } finally {
    guardando.value = false
  }
}

// Volver a la vista anterior
const volver = () => {
  router.push({ name: 'direccion-anios-ver' })
}

// Inicializar fechas por defecto al montar el componente
onMounted(() => {
  const nextYear = new Date().getFullYear() + 1
  
  // Fecha de inicio por defecto: 1 de febrero del próximo año
  const fechaInicio = new Date(nextYear, 1, 1) // Mes 1 = febrero (0-indexed)
  formData.fechaInicio = fechaInicio.toISOString().split('T')[0]
  
  // Fecha de fin por defecto: 30 de noviembre del próximo año
  const fechaFin = new Date(nextYear, 10, 30) // Mes 10 = noviembre (0-indexed)
  formData.fechaFin = fechaFin.toISOString().split('T')[0]
})
</script>

<style>
@import '@/assets/styles/dashboards/direccion/crearanio.css';
</style>
