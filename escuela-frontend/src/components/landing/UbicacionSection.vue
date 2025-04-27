<template>
  <div class="ubicacion-section">
    <div class="ubicacion-container">
      <div class="section-header">
        <h2>Ubicación</h2>
      </div>
      
      <div class="ubicacion-content">
        <div class="map-container">
          <iframe 
            :src="mapUrl" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="true" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        
        <div class="location-info">
          <div class="location-item">
            <h3 class="school-name">Escuela Manuela Santamaría</h3>
            <div class="location-details">
              <div class="location-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <p class="address">{{ direccion }}</p>
            </div>
            <div class="location-details">
              <div class="location-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <p class="phone">{{ telefono }}</p>
            </div>
          </div>
          
          <a :href="direccionesUrl" target="_blank" class="map-directions-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            CÓMO LLEGAR
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Datos de ubicación (pueden ser reemplazados por datos reales en el futuro)
// Nota: estas coordenadas están disponibles para uso futuro si se necesita personalizar el mapa

const direccion = ref('2RF6+2GH, Alajuela Desamparados de, Provincia de Alajuela, Alajuela');
const telefono = ref('+506 2430 1392');

// URL para el iframe de Google Maps
const mapUrl = computed(() => {
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(direccion.value)}&zoom=15`;
});

// URL para el botón "Cómo llegar"
const direccionesUrl = computed(() => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccion.value)}`;
});
</script>

<style scoped>
.ubicacion-section {
  background-color: var(--bg-off-white);
  padding: var(--spacing-3xl) 0;
}

.ubicacion-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h2 {
  color: var(--text-dark);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-3xl);
  margin-bottom: 0;
  position: relative;
  display: inline-block;
  padding-bottom: 15px;
}

h2::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.ubicacion-content {
  display: flex;
  gap: 2rem;
  align-items: stretch;
}

.map-container {
  flex: 1;
  height: 500px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.map-container:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.location-info {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.location-item {
  padding: var(--spacing-xl);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.location-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.school-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  position: relative;
  padding-bottom: var(--spacing-sm);
}

.school-name::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary-color);
}

.location-details {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.location-icon {
  color: var(--primary-color);
  margin-right: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.address, .phone {
  color: var(--text-medium);
  line-height: 1.5;
  margin: 0;
  font-size: var(--font-size-base);
}

.map-directions-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  text-align: center;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-bold);
  letter-spacing: 1px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.map-directions-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.button-icon {
  transition: transform 0.3s ease;
}

.map-directions-button:hover .button-icon {
  transform: translateX(3px);
}

@media (max-width: 768px) {
  .ubicacion-content {
    flex-direction: column;
  }
  
  .map-container {
    height: 350px;
  }
  
  .location-info {
    flex: 1;
    margin-top: var(--spacing-lg);
  }
  
  .map-directions-button {
    align-self: center;
    width: 100%;
  }

  .section-header h2 {
    font-size: var(--font-size-2xl);
  }

  .school-name {
    font-size: var(--font-size-xl);
  }
}
</style>
