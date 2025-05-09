<template>
  <div class="calendar-container">
    <div v-if="showHeader" class="calendar-header">
      <h1>{{ title }}</h1>
      <div class="calendar-actions">
        <button v-if="canCreateEvents" class="btn-primary" @click="showEventModal('create')">
          <font-awesome-icon :icon="['fas', 'plus']" /> Nuevo Evento
        </button>
      </div>
    </div>

    <vue-cal
      ref="vuecal"
      :events="eventos"
      :time-from="8 * 60"
      :time-to="18 * 60"
      :disable-views="['years']"
      :editable-events="{ title: true, drag: true, resize: true, delete: true, create: true }"
      class="escuela-calendar"
      locale="es"
      :on-event-click="onEventClick"
      :on-event-create="crearEvento"
      :on-event-drag-create="crearEvento"
      :on-event-update="actualizarEvento"
      :on-event-delete="eliminarEvento"
      today-button
      hide-weekends
      style="height: 600px"
    />

    <!-- Modal para crear/editar eventos -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ modalMode === 'create' ? 'Crear Nuevo Evento' : 'Editar Evento' }}</h2>
          <button class="close-button" @click="closeModal">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="event-title">Título</label>
            <input
              id="event-title"
              v-model="currentEvent.title"
              type="text"
              placeholder="Título del evento"
              class="form-input"
            />
          </div>
          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="event-start-date">Fecha de inicio</label>
              <input
                id="event-start-date"
                v-model="eventStartDate"
                type="date"
                class="form-input"
              />
            </div>
            <div class="form-group form-group-half">
              <label for="event-start-time">Hora de inicio</label>
              <select id="event-start-time" v-model="eventStartTime" class="form-input time-select">
                <option v-for="time in timeOptions" :key="time" :value="time">
                  {{ formatTimeDisplay(time) }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group form-group-half">
              <label for="event-end-date">Fecha de fin</label>
              <input id="event-end-date" v-model="eventEndDate" type="date" class="form-input" />
            </div>
            <div class="form-group form-group-half">
              <label for="event-end-time">Hora de fin</label>
              <select id="event-end-time" v-model="eventEndTime" class="form-input time-select">
                <option v-for="time in timeOptions" :key="time" :value="time">
                  {{ formatTimeDisplay(time) }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="event-content">Descripción</label>
            <textarea
              id="event-content"
              v-model="currentEvent.content"
              placeholder="Descripción del evento"
              class="form-input"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="event-class">Color</label>
            <select id="event-class" v-model="currentEvent.class" class="form-input">
              <option value="event-blue">Azul</option>
              <option value="event-green">Verde</option>
              <option value="event-orange">Naranja</option>
              <option value="event-red">Rojo</option>
              <option value="event-purple">Morado</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn-primary" @click="saveEvent">
            {{ modalMode === 'create' ? 'Crear' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useCalendar, type Evento } from '@/composables/dashboards/useCalendar'

// Definir props
const props = defineProps({
  userRole: {
    type: String,
    default: 'profesor',
    validator: (value: string) => ['profesor', 'direccion'].includes(value)
  },
  canCreateEvents: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Calendario Escolar'
  }
})

// Definir emits
const emit = defineEmits(['event-created', 'event-updated', 'event-deleted'])

// Configurar callbacks para el composable
const onEventCreated = (event: Evento) => {
  emit('event-created', event)
}

const onEventUpdated = (event: Evento) => {
  emit('event-updated', event)
}

const onEventDeleted = (event: Evento) => {
  emit('event-deleted', event)
}

// Usar el composable de calendario con las opciones y callbacks
const {
  vuecal,
  showModal,
  modalMode,
  currentEvent,
  eventStartDate,
  eventStartTime,
  eventEndDate,
  eventEndTime,
  timeOptions,
  eventos,
  formatTimeDisplay,
  showEventModal,
  closeModal,
  saveEvent,
  onEventClick,
  crearEvento,
  actualizarEvento,
  eliminarEvento
} = useCalendar({
  userRole: props.userRole,
  onEventCreated,
  onEventUpdated,
  onEventDeleted
})
</script>

<style>
@import '@/assets/styles/dashboards/calendar.css';
</style>
