<template>
  <div class="attendance-view">
    <!-- Sección de registro de asistencia actual -->
    <div class="card-section">
      <div class="section-header" @click="toggleCurrentSection">
        <div class="header-content">
          <h1>Registro de Asistencia</h1>
          <p class="current-date">{{ formattedDate }}</p>
        </div>
        <button class="toggle-button" :class="{ collapsed: !showCurrentSection }">
          <font-awesome-icon icon="chevron-down" />
        </button>
      </div>

      <div class="section-content" v-show="showCurrentSection">
        <!-- Selector de grupo -->
        <div class="group-selector">
          <label for="group-select">Seleccione un grupo:</label>
          <select id="group-select" v-model="selectedGroup" class="form-select" :disabled="loading">
            <option value="" disabled>Seleccione un grupo</option>
            <option v-for="group in teacherGroups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>

        <!-- Tabla de asistencia -->
        <div v-if="selectedGroup && !loading" class="attendance-table-container">
          <div class="table-actions">
            <div class="date-selector">
              <label for="attendance-date">Fecha:</label>
              <input type="date" id="attendance-date" v-model="attendanceDate" class="form-input" />
            </div>
            <div class="bulk-actions">
              <button
                @click="markAllAs('present')"
                class="btn-action present"
                title="Marcar todos como presentes"
              >
                <font-awesome-icon icon="fa-check" /> Todos presentes
              </button>
            </div>
          </div>

          <table class="attendance-table">
            <thead>
              <tr>
                <th class="student-column">Estudiante</th>
                <th class="status-column">Estado</th>
                <th class="comment-column">Comentario</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in students"
                :key="student.id"
                :class="{ absent: student.status === 'absent' }"
              >
                <td class="student-info">
                  <div class="student-name">{{ student.name }}</div>
                  <div class="student-id">ID: {{ student.id }}</div>
                </td>
                <td class="status-selector">
                  <div class="status-options">
                    <div
                      @click="updateStatus(student.id, 'present')"
                      :class="['status-option', { active: student.status === 'present' }]"
                    >
                      <div class="status-icon present">
                        <font-awesome-icon icon="fa-check" />
                      </div>
                      <span class="status-label">Presente</span>
                    </div>

                    <div
                      @click="updateStatus(student.id, 'absent')"
                      :class="['status-option', { active: student.status === 'absent' }]"
                    >
                      <div class="status-icon absent">
                        <font-awesome-icon icon="fa-times" />
                      </div>
                      <span class="status-label">Ausente</span>
                    </div>

                    <div
                      @click="updateStatus(student.id, 'justified')"
                      :class="['status-option', { active: student.status === 'justified' }]"
                    >
                      <div class="status-icon justified">
                        <font-awesome-icon icon="fa-file" />
                      </div>
                      <span class="status-label">Justificada</span>
                    </div>

                    <div
                      @click="updateStatus(student.id, 'late')"
                      :class="['status-option', { active: student.status === 'late' }]"
                    >
                      <div class="status-icon late">
                        <font-awesome-icon icon="fa-clock" />
                      </div>
                      <span class="status-label">Tardía</span>
                    </div>
                  </div>
                </td>
                <td class="comment-cell">
                  <input
                    type="text"
                    v-model="student.comment"
                    placeholder="Comentario (opcional)"
                    class="comment-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="attendance-actions">
            <button @click="saveAttendance" class="save-button" :disabled="saving">
              <span v-if="!saving">Guardar Asistencia</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </div>
        </div>

        <!-- Estado de carga -->
        <div v-else-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando información...</p>
        </div>

        <!-- Mensaje cuando no hay grupo seleccionado -->
        <div v-else class="no-group-selected">
          <p>Por favor seleccione un grupo para registrar la asistencia</p>
        </div>

        <!-- Notificación de confirmación -->
        <div
          v-if="showConfirmation"
          class="confirmation-message"
          :class="{ show: showConfirmation }"
        >
          <div class="confirmation-content">
            <font-awesome-icon icon="fa-check-circle" class="confirmation-icon" />
            <p>¡Asistencia guardada correctamente!</p>
          </div>
        </div>
      </div>

      <!-- Sección de historial de asistencia -->
      <div class="card-section history-section">
        <div class="section-header" @click="toggleHistorySection">
          <div class="header-content">
            <h2>Historial de Asistencia</h2>
            <p class="section-description">
              Consulte la asistencia registrada en fechas anteriores
            </p>
          </div>
          <button class="toggle-button" :class="{ collapsed: !showHistorySection }">
            <font-awesome-icon icon="chevron-down" />
          </button>
        </div>

        <div class="section-content" v-show="showHistorySection">
          <div class="history-filters">
            <div class="filter-group">
              <label for="history-group-select">Grupo:</label>
              <select
                id="history-group-select"
                v-model="historySelectedGroup"
                class="form-select"
                :disabled="historyLoading"
              >
                <option value="" disabled>Seleccione un grupo</option>
                <option v-for="group in teacherGroups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label for="history-date">Fecha:</label>
              <input
                type="date"
                id="history-date"
                v-model="historyDate"
                class="form-input"
                :disabled="historyLoading"
              />
            </div>

            <div class="filter-group">
              <button
                @click="fetchAttendanceHistory"
                class="search-button"
                :disabled="!historySelectedGroup || historyLoading"
              >
                <font-awesome-icon icon="search" />
                <span>Consultar</span>
              </button>
            </div>
          </div>

          <!-- Tabla de historial de asistencia -->
          <div v-if="historyLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Cargando historial...</p>
          </div>

          <div v-else-if="historyRecords.length > 0" class="history-table-container">
            <table class="attendance-table history-table">
              <thead>
                <tr>
                  <th class="student-column">Estudiante</th>
                  <th class="status-column">Estado</th>
                  <th class="comment-column">Comentario</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="record in historyRecords"
                  :key="record.id"
                  :class="{ absent: record.status === 'absent' }"
                >
                  <td class="student-info">
                    <div class="student-name">{{ record.name }}</div>
                    <div class="student-id">ID: {{ record.id }}</div>
                  </td>
                  <td class="status-cell">
                    <span v-if="record.status === 'present'" class="status-badge present">
                      <font-awesome-icon icon="check" /> Presente
                    </span>
                    <span v-else-if="record.status === 'absent'" class="status-badge absent">
                      <font-awesome-icon icon="times" /> Ausente
                    </span>
                    <span v-else-if="record.status === 'justified'" class="status-badge justified">
                      <font-awesome-icon icon="file" /> Justificada
                    </span>
                    <span v-else-if="record.status === 'late'" class="status-badge late">
                      <font-awesome-icon icon="clock" /> Tardía
                    </span>
                  </td>
                  <td class="comment-cell">
                    <p class="history-comment">{{ record.comment || 'Sin comentarios' }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="historySearched" class="no-records-message">
            <font-awesome-icon icon="info-circle" class="info-icon" />
            <p>No se encontraron registros de asistencia para el grupo y fecha seleccionados.</p>
          </div>

          <div v-else class="no-search-message">
            <p>Seleccione un grupo y una fecha para consultar el historial de asistencia.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttendance } from '@/composables/useAttendance'

const {
  loading,
  saving,
  selectedGroup,
  attendanceDate,
  showConfirmation,
  showCurrentSection,
  showHistorySection,
  historyLoading,
  historySelectedGroup,
  historyDate,
  historyRecords,
  historySearched,
  formattedDate,
  teacherGroups,
  students,
  updateStatus,
  markAllAs,
  toggleCurrentSection,
  toggleHistorySection,
  saveAttendance,
  fetchAttendanceHistory,
} = useAttendance()
</script>

<style scoped>
@import '@/assets/styles/dashboards/attendance.css';
</style>
