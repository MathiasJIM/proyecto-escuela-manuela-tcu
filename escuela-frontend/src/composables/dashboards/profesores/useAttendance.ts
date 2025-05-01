import { ref, computed, watch } from 'vue'

// Definición de tipos
export type AttendanceStatus = 'present' | 'absent' | 'justified' | 'late'

export interface StudentRecord {
  id: string
  name: string
  status: AttendanceStatus
  comment: string
}

export function useAttendance() {
  // Estado del componente
  const loading = ref(false)
  const saving = ref(false)
  const selectedGroup = ref('')
  const attendanceDate = ref('')
  const showConfirmation = ref(false)

  // Estado de las secciones plegables
  const showCurrentSection = ref(true)
  const showHistorySection = ref(true)

  // Estado del componente - Historial de asistencia
  const historyLoading = ref(false)
  const historySelectedGroup = ref('')
  const historyDate = ref('')
  const historyRecords = ref<StudentRecord[]>([])
  const historySearched = ref(false)

  // Fecha actual formateada
  const formattedDate = computed(() => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return now.toLocaleDateString('es-ES', options)
  })

  // Datos de ejemplo - Grupos asignados al docente
  const teacherGroups = [
    { id: '1', name: '5A - Quinto Grado A' },
    { id: '2', name: '6B - Sexto Grado B' },
    { id: '3', name: '4C - Cuarto Grado C' },
  ]

  // Datos de ejemplo - Estudiantes del grupo seleccionado
  const studentsData = ref<StudentRecord[]>([])

  // Cargar estudiantes cuando cambia el grupo seleccionado
  const loadStudents = () => {
    if (!selectedGroup.value) {
      studentsData.value = []
      return
    }
    
    loading.value = true
    
    try {
      // Simulación de datos
      // En un caso real, estos datos vendrían del backend
      setTimeout(() => {
        studentsData.value = [
          { id: '001', name: 'Ana María Rodríguez', status: 'present', comment: '' },
          { id: '002', name: 'Carlos Jiménez Mora', status: 'present', comment: '' },
          { id: '003', name: 'Sofía Hernández Castro', status: 'present', comment: '' },
        ]
        loading.value = false
      }, 500)
    } catch (error) {
      console.error('Error al cargar estudiantes:', error)
      loading.value = false
    }
  }

  // Observar cambios en el grupo seleccionado
  watch(selectedGroup, () => {
    loadStudents()
  })

  // Estudiantes como computed para mantener compatibilidad con el resto del componente
  const students = computed(() => studentsData.value)

  // Función para actualizar el estado de asistencia de un estudiante
  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    const student = students.value.find((s) => s.id === studentId)
    if (student) {
      student.status = status
    }
  }

  // Función para marcar a todos los estudiantes con un estado específico
  const markAllAs = (status: AttendanceStatus) => {
    students.value.forEach((student) => {
      student.status = status
    })
  }

  // Funciones para controlar las secciones plegables
  const toggleCurrentSection = () => {
    showCurrentSection.value = !showCurrentSection.value
  }

  const toggleHistorySection = () => {
    showHistorySection.value = !showHistorySection.value
  }

  // Función para guardar la asistencia
  const saveAttendance = async () => {
    if (!selectedGroup.value) return

    saving.value = true

    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Guardando asistencia:', {
        groupId: selectedGroup.value,
        date: attendanceDate.value,
        students: students.value,
      })

      showConfirmation.value = true
      setTimeout(() => {
        showConfirmation.value = false
      }, 3000)
    } catch (error) {
      console.error('Error al guardar:', error)
    } finally {
      saving.value = false
    }
  }

  // Función para consultar el historial de asistencia
  const fetchAttendanceHistory = async () => {
    if (!historySelectedGroup.value || !historyDate.value) return

    historyLoading.value = true
    historySearched.value = true

    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de ejemplo para el historial
      // En un caso real, estos datos vendrían del backend
      if (Math.random() > 0.3) {
        // 70% de probabilidad de encontrar registros
        historyRecords.value = [
          { id: '101', name: 'Ana María Rodríguez', status: 'present', comment: 'Llegó temprano' },
          { id: '102', name: 'Carlos Jiménez Mora', status: 'absent', comment: 'No se presentó' },
          { id: '103', name: 'Sofía Hernández Castro', status: 'justified', comment: 'Cita médica' },
        ]
      } else {
        // Simular que no hay registros
        historyRecords.value = []
      }

      console.log('Consultando historial:', {
        groupId: historySelectedGroup.value,
        date: historyDate.value,
      })
    } catch (error) {
      console.error('Error al consultar el historial:', error)
      historyRecords.value = []
    } finally {
      historyLoading.value = false
    }
  }

  // Inicializar fechas
  const initializeDates = () => {
    // Establecer la fecha actual
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    attendanceDate.value = `${year}-${month}-${day}`

    // Fecha de ayer para historial
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yYear = yesterday.getFullYear()
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0')
    const yDay = String(yesterday.getDate()).padStart(2, '0')
    historyDate.value = `${yYear}-${yMonth}-${yDay}`
  }

  return {
    // Estado
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
    
    // Métodos
    loadStudents,
    updateStatus,
    markAllAs,
    toggleCurrentSection,
    toggleHistorySection,
    saveAttendance,
    fetchAttendanceHistory,
    initializeDates
  }
}
