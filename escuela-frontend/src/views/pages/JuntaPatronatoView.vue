<template>
  <div class="junta-patronato-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-image">
        <img src="@/assets/images/imagen-de-la-escuela.png" alt="Junta y Patronato Escolar" />
      </div>
      <div class="title-bar">
        <h1>Junta y Patronato Escolar</h1>
      </div>
    </div>

    <!-- Pestañas -->
    <div class="tabs-container">
      <div class="container">
        <div class="tabs-wrapper">
          <div 
            class="tab" 
            :class="{ 'active': activeTab === 'junta' }" 
            @click="activeTab = 'junta'"
          >
            Junta Escolar
          </div>
          <div 
            class="tab" 
            :class="{ 'active': activeTab === 'patronato' }" 
            @click="activeTab = 'patronato'"
          >
            Patronato Escolar
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="tab-content">
      <div class="container">
        <!-- Junta Escolar -->
        <div v-if="activeTab === 'junta'" class="miembros-container">
          <div 
            v-for="miembro in juntaEscolar" 
            :key="miembro.id"
            class="miembro-card"
          >
            <div class="miembro-info">
              <h3>{{ miembro.nombre }}</h3>
              <p class="miembro-puesto">{{ miembro.puesto }}</p>
            </div>
            <button class="btn-informes" @click="mostrarInformes(miembro)">
              Ver informes
            </button>
          </div>
        </div>

        <!-- Patronato Escolar -->
        <div v-if="activeTab === 'patronato'" class="miembros-container">
          <div 
            v-for="miembro in patronatoEscolar" 
            :key="miembro.id"
            class="miembro-card"
          >
            <div class="miembro-info">
              <h3>{{ miembro.nombre }}</h3>
              <p class="miembro-puesto">{{ miembro.puesto }}</p>
            </div>
            <button class="btn-informes" @click="mostrarInformes(miembro)">
              Ver informes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de donaciones -->
    <div class="donaciones-section">
      <div class="container">
        <h2>Información para Donaciones</h2>
        <div class="donaciones-container">
          <div class="cuenta-donacion">
            <h3>Cuenta Bancaria</h3>
            <p class="cuenta-numero">{{ cuentasDonacion[0].numero }}</p>
            <p class="cuenta-banco">{{ cuentasDonacion[0].banco }}</p>
            <p class="cuenta-descripcion">{{ cuentasDonacion[0].descripcion }}</p>
          </div>
          <div class="cuenta-donacion">
            <h3>SINPE Móvil</h3>
            <p class="cuenta-numero">{{ cuentasDonacion[1].numero }}</p>
            <p class="cuenta-descripcion">{{ cuentasDonacion[1].descripcion }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar informes -->
    <div class="modal" v-if="modalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Informes de {{ miembroSeleccionado?.nombre }}</h3>
          <button class="close-button" @click="cerrarModal">
            <font-awesome-icon icon="fa-xmark" />
          </button>
        </div>
        <div class="modal-body">
          <div class="informes-list">
            <div v-if="miembroSeleccionado?.informes?.length" class="informes-container">
              <div v-for="informe in miembroSeleccionado.informes" :key="informe.id" class="informe-item">
                <div class="informe-info">
                  <h4>{{ informe.titulo }}</h4>
                  <p class="informe-fecha">{{ informe.fecha }}</p>
                </div>
                <button class="btn-descargar">Ver informe</button>
              </div>
            </div>
            <div v-else class="no-informes">
              No hay informes disponibles
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Interfaces
interface Informe {
  id: number;
  titulo: string;
  fecha: string;
  archivo: string;
}

interface Miembro {
  id: number;
  nombre: string;
  puesto: string;
  foto: string;
  informes: Informe[];
}

// Estado
const activeTab = ref('junta');
const modalVisible = ref(false);
const miembroSeleccionado = ref<Miembro | null>(null);

// Datos simulados
const juntaEscolar = ref<Miembro[]>([
  {
    id: 1,
    nombre: 'María Rodríguez',
    puesto: 'Presidenta',
    foto: '/src/assets/images/avatars/avatar-1.jpg',
    informes: [
      { id: 1, titulo: 'Informe Anual 2024', fecha: '15/03/2024', archivo: 'informe_anual_2024.pdf' },
      { id: 2, titulo: 'Presupuesto 2024-2025', fecha: '20/01/2024', archivo: 'presupuesto_2024.pdf' }
    ]
  },
  {
    id: 2,
    nombre: 'Carlos Jiménez',
    puesto: 'Vicepresidente',
    foto: '/src/assets/images/avatars/avatar-2.jpg',
    informes: [
      { id: 3, titulo: 'Informe de Proyectos', fecha: '10/02/2024', archivo: 'informe_proyectos.pdf' }
    ]
  },
  {
    id: 3,
    nombre: 'Laura Méndez',
    puesto: 'Secretaria',
    foto: '/src/assets/images/avatars/avatar-3.jpg',
    informes: [
      { id: 4, titulo: 'Actas de Reuniones', fecha: '05/04/2024', archivo: 'actas_reuniones.pdf' }
    ]
  },
  {
    id: 4,
    nombre: 'Roberto Sánchez',
    puesto: 'Tesorero',
    foto: '/src/assets/images/avatars/avatar-4.jpg',
    informes: [
      { id: 5, titulo: 'Balance Financiero', fecha: '30/03/2024', archivo: 'balance_financiero.pdf' },
      { id: 6, titulo: 'Informe de Gastos', fecha: '15/02/2024', archivo: 'informe_gastos.pdf' }
    ]
  },
  {
    id: 5,
    nombre: 'Ana Vargas',
    puesto: 'Vocal',
    foto: '/src/assets/images/avatars/avatar-5.jpg',
    informes: [
      { id: 7, titulo: 'Informe de Actividades', fecha: '20/03/2024', archivo: 'informe_actividades.pdf' }
    ]
  }
]);

const patronatoEscolar = ref<Miembro[]>([
  {
    id: 6,
    nombre: 'José Mora',
    puesto: 'Presidente',
    foto: '/src/assets/images/avatars/avatar-6.jpg',
    informes: [
      { id: 8, titulo: 'Informe Anual Patronato', fecha: '10/03/2024', archivo: 'informe_anual_patronato.pdf' }
    ]
  },
  {
    id: 7,
    nombre: 'Silvia Castro',
    puesto: 'Vicepresidenta',
    foto: '/src/assets/images/avatars/avatar-7.jpg',
    informes: [
      { id: 9, titulo: 'Plan de Trabajo', fecha: '05/01/2024', archivo: 'plan_trabajo.pdf' }
    ]
  },
  {
    id: 8,
    nombre: 'Miguel Araya',
    puesto: 'Secretario',
    foto: '/src/assets/images/avatars/avatar-8.jpg',
    informes: [
      { id: 10, titulo: 'Actas de Sesiones', fecha: '15/02/2024', archivo: 'actas_sesiones.pdf' }
    ]
  },
  {
    id: 9,
    nombre: 'Carmen Solís',
    puesto: 'Tesorera',
    foto: '/src/assets/images/avatars/avatar-9.jpg',
    informes: [
      { id: 11, titulo: 'Informe Financiero', fecha: '20/03/2024', archivo: 'informe_financiero.pdf' },
      { id: 12, titulo: 'Presupuesto Anual', fecha: '10/01/2024', archivo: 'presupuesto_anual.pdf' }
    ]
  },
  {
    id: 10,
    nombre: 'Daniel Rojas',
    puesto: 'Vocal',
    foto: '/src/assets/images/avatars/avatar-10.jpg',
    informes: [
      { id: 13, titulo: 'Informe de Proyectos Especiales', fecha: '25/02/2024', archivo: 'proyectos_especiales.pdf' }
    ]
  }
]);

const cuentasDonacion = ref([
  {
    tipo: 'Cuenta Bancaria',
    numero: 'CR73015108810026012345',
    banco: 'Banco Nacional',
    descripcion: 'Cuenta principal para donaciones y pagos de libretas'
  },
  {
    tipo: 'SINPE Móvil',
    numero: '8888-1234',
    descripcion: 'Para donaciones rápidas mediante SINPE Móvil'
  }
]);

// Métodos
const mostrarInformes = (miembro: Miembro) => {
  miembroSeleccionado.value = miembro;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
  miembroSeleccionado.value = null;
};

// Lifecycle hooks
onMounted(() => {
  // Aquí se podrían cargar los datos desde una API
  console.log('Componente JuntaPatronatoView montado');
});
</script>

<style scoped>
@import '@/assets/styles/pages/patronato.css';
</style>
