import { defineStore } from 'pinia'
import { ref } from 'vue'
import { avisosService, type Aviso, type AvisoCreate } from '@/services/avisos.service'

export const useAvisosStore = defineStore('avisos', () => {
  // Estado
  const avisos = ref<Aviso[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Acciones
  async function cargarAvisos() {
    loading.value = true
    error.value = null
    try {
      const data = await avisosService.obtenerAvisos()
      avisos.value = data
    } catch (e) {
      error.value = 'Error al cargar los avisos'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function crearAviso(aviso: AvisoCreate) {
    loading.value = true
    error.value = null
    try {
      const nuevoAviso = await avisosService.crearAviso(aviso)
      avisos.value.push(nuevoAviso)
    } catch (e) {
      error.value = 'Error al crear el aviso'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function actualizarAviso(aviso: Aviso) {
    loading.value = true
    error.value = null
    try {
      const avisoActualizado = await avisosService.actualizarAviso(aviso)
      const index = avisos.value.findIndex((a: Aviso) => a.id_aviso === aviso.id_aviso)
      if (index !== -1) {
        avisos.value[index] = avisoActualizado
      }
    } catch (e) {
      error.value = 'Error al actualizar el aviso'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function eliminarAviso(id: string) {
    loading.value = true
    error.value = null
    try {
      await avisosService.eliminarAviso(id)
      avisos.value = avisos.value.filter((a: Aviso) => a.id_aviso !== id)
    } catch (e) {
      error.value = 'Error al eliminar el aviso'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    avisos,
    loading,
    error,

    // Acciones
    cargarAvisos,
    crearAviso,
    actualizarAviso,
    eliminarAviso
  }
})
