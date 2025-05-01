<template>
  <div class="dashboard-home">
    <header class="dashboard-header">
      <h1>Bienvenido, Profesor</h1>
      <p class="current-date">{{ formattedDate }}</p>
    </header>
    
    <div class="dashboard-cards">
      <div class="dashboard-card">
        <div class="card-icon attendance">
          <font-awesome-icon icon="fa-clipboard-check" size="lg" />
        </div>
        <div class="card-content">
          <h3>Asistencia</h3>
          <p>Registrar asistencia del día</p>
        </div>
      </div>
      
      <div class="dashboard-card">
        <div class="card-icon calendar">
          <font-awesome-icon icon="fa-calendar-alt" size="lg" />
        </div>
        <div class="card-content">
          <h3>Calendario</h3>
          <p>Ver eventos próximos</p>
        </div>
      </div>
      
      <div class="dashboard-card">
        <div class="card-icon material">
          <font-awesome-icon icon="fa-book" size="lg" />
        </div>
        <div class="card-content">
          <h3>Material</h3>
          <p>Subir material didáctico</p>
        </div>
      </div>
      
      <div class="dashboard-card">
        <div class="card-icon notification">
          <font-awesome-icon icon="fa-bell" size="lg" />
        </div>
        <div class="card-content">
          <h3>Notificaciones</h3>
          <p>2 notificaciones nuevas</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-sections">
      <section class="upcoming-events">
        <h2>Próximos Eventos</h2>
        <div class="event-list">
          <div class="event-item">
            <div class="event-date">
              <span class="event-day">15</span>
              <span class="event-month">Mayo</span>
            </div>
            <div class="event-details">
              <h4>Reunión de Padres</h4>
              <p>2:00 PM - 4:00 PM</p>
            </div>
          </div>
          
          <div class="event-item">
            <div class="event-date">
              <span class="event-day">20</span>
              <span class="event-month">Mayo</span>
            </div>
            <div class="event-details">
              <h4>Entrega de Notas</h4>
              <p>9:00 AM - 12:00 PM</p>
            </div>
          </div>
          
          <div class="event-item">
            <div class="event-date">
              <span class="event-day">25</span>
              <span class="event-month">Mayo</span>
            </div>
            <div class="event-details">
              <h4>Acto Cívico</h4>
              <p>8:00 AM - 9:30 AM</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="recent-notifications">
        <h2>Notificaciones Recientes</h2>
        <div class="notification-list">
          <div class="notification-item unread">
            <div class="notification-icon">
              <font-awesome-icon icon="fa-bell" />
            </div>
            <div class="notification-content">
              <h4>Reunión de personal</h4>
              <p>Se ha programado una reunión de personal para el viernes a las 3:00 PM.</p>
              <span class="notification-time">Hace 2 horas</span>
            </div>
          </div>
          
          <div class="notification-item unread">
            <div class="notification-icon">
              <font-awesome-icon icon="fa-bell" />
            </div>
            <div class="notification-content">
              <h4>Nueva solicitud de cita</h4>
              <p>Un padre ha solicitado una cita para el próximo martes.</p>
              <span class="notification-time">Hace 5 horas</span>
            </div>
          </div>
          
          <div class="notification-item">
            <div class="notification-icon">
              <font-awesome-icon icon="fa-bell" />
            </div>
            <div class="notification-content">
              <h4>Recordatorio de entrega</h4>
              <p>Recuerde entregar las calificaciones del primer trimestre antes del viernes.</p>
              <span class="notification-time">Ayer</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
</script>

<style scoped>
@import '@/assets/styles/dashboards/dashboardhome.css';
</style>
