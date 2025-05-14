<template>
  <div class="dashboard-home">
    <header class="dashboard-header">
      <h1>Bienvenido/a al Portal Administrativo</h1>
      <p class="current-date">{{ formattedDate }}</p>
    </header>
    
    <div class="dashboard-cards">
      <div class="dashboard-card" @click="navigateTo('/dashboard/direccion/calendario')">
        <div class="card-icon calendar">
          <font-awesome-icon :icon="['fas', 'calendar-alt']" size="lg" />
        </div>
        <div class="card-content">
          <h3>Calendario</h3>
          <p>Ver eventos próximos</p>
        </div>
      </div>
      
      <div class="dashboard-card" @click="navigateTo('/dashboard/direccion/documentos')">
        <div class="card-icon material">
          <font-awesome-icon :icon="['fas', 'folder']" size="lg" />
        </div>
        <div class="card-content">
          <h3>Documentos</h3>
          <p>Gestionar documentos</p>
        </div>
      </div>
      
      <div class="dashboard-card" @click="navigateTo('/dashboard/direccion/avisos')">
        <div class="card-icon notification">
          <font-awesome-icon :icon="['fas', 'bell']" size="lg" />
        </div>
        <div class="card-content">
          <h3>Avisos</h3>
          <p>{{ estadisticas.avisos }} avisos nuevos</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-sections">
      <section class="upcoming-events">
        <h2>Próximos Eventos</h2>
        <div class="event-list">
          <div class="event-item" v-for="(evento, index) in eventos" :key="index">
            <div class="event-date">
              <span class="event-day">{{ evento.dia }}</span>
              <span class="event-month">{{ evento.mes }}</span>
            </div>
            <div class="event-details">
              <h4>{{ evento.titulo }}</h4>
              <p>{{ evento.horario }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="recent-notifications">
        <h2>Notificaciones Recientes</h2>
        <div class="notification-list">
          <div class="notification-item" v-for="(notificacion, index) in notificaciones" :key="index" :class="{ unread: notificacion.noLeida }">
            <div class="notification-icon">
              <font-awesome-icon :icon="notificacion.icono" />
            </div>
            <div class="notification-content">
              <h4>{{ notificacion.titulo }}</h4>
              <p>{{ notificacion.descripcion }}</p>
              <span class="notification-time">{{ notificacion.tiempo }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Estadisticas {
  profesores: number;
  estudiantes: number;
  padres: number;
  materias: number;
  avisos: number;
}

interface Evento {
  dia: number;
  mes: string;
  titulo: string;
  horario: string;
}

interface Notificacion {
  titulo: string;
  descripcion: string;
  tiempo: string;
  icono: string[];
  noLeida: boolean;
}

// Estado
const estadisticas = ref<Estadisticas>({
  profesores: 12,
  estudiantes: 345,
  padres: 420,
  materias: 24,
  avisos: 3
});

const eventos = ref<Evento[]>([
  {
    dia: 15,
    mes: 'Mayo',
    titulo: 'Reunión de Padres',
    horario: '2:00 PM - 4:00 PM'
  },
  {
    dia: 20,
    mes: 'Mayo',
    titulo: 'Entrega de Notas',
    horario: '9:00 AM - 12:00 PM'
  },
  {
    dia: 25,
    mes: 'Mayo',
    titulo: 'Acto Cívico',
    horario: '8:00 AM - 9:30 AM'
  }
]);

const notificaciones = ref<Notificacion[]>([
  {
    titulo: 'Reunión de personal',
    descripcion: 'Se ha programado una reunión de personal para el viernes a las 3:00 PM.',
    tiempo: 'Hace 2 horas',
    icono: ['fas', 'user-tie'],
    noLeida: true
  },
  {
    titulo: 'Nueva solicitud de cita',
    descripcion: 'Un padre ha solicitado una cita para el próximo martes.',
    tiempo: 'Hace 5 horas',
    icono: ['fas', 'calendar-alt'],
    noLeida: true
  },
  {
    titulo: 'Recordatorio de entrega',
    descripcion: 'Recuerde entregar las calificaciones del primer trimestre antes del viernes.',
    tiempo: 'Ayer',
    icono: ['fas', 'bell'],
    noLeida: false
  }
]);

// Fecha actual formateada
const formattedDate = computed(() => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return now.toLocaleDateString('es-ES', options);
});

// Navegación
const navigateTo = (path: string) => {
  router.push(path);
};

// Cargar datos
onMounted(() => {
  // En producción, aquí se cargarían los datos desde la API
  // Por ahora usamos datos estáticos
});
</script>

<style scoped>
/* Estilos generales */
.dashboard-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 5px 0;
}

.current-date {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

/* Tarjetas de acciones */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.dashboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.attendance {
  background-color: #e0f2fe;
  color: #0284c7;
}

.calendar {
  background-color: #dcfce7;
  color: #16a34a;
}

.material {
  background-color: #fef3c7;
  color: #d97706;
}

.notification {
  background-color: #f3e8ff;
  color: #7e22ce;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 5px 0;
}

.card-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Secciones del dashboard */
.dashboard-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.upcoming-events, .recent-notifications {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.upcoming-events h2, .recent-notifications h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

/* Eventos */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.event-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #f1f5f9;
  border-radius: 8px;
  margin-right: 15px;
  flex-shrink: 0;
}

.event-day {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.event-month {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
}

.event-details {
  flex: 1;
}

.event-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 5px 0;
}

.event-details p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Notificaciones */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
  opacity: 0.7;
}

.notification-item.unread {
  opacity: 1;
}

.notification-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 5px 0;
}

.notification-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #94a3b8;
  display: block;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard-card {
    padding: 15px;
  }
  
  .dashboard-header h1 {
    font-size: 20px;
  }
}
</style>
