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
                <font-awesome-icon :icon="['fas', 'location-dot']" size="lg" class="text-primary" />
              </div>
              <p class="address">{{ direccion }}</p>
            </div>
            <div class="location-details">
              <div class="location-icon">
                <font-awesome-icon :icon="['fas', 'phone']" size="lg" class="text-primary" />
              </div>
              <p class="phone">{{ telefono }}</p>
            </div>
          </div>
          
          <a :href="direccionesUrl" target="_blank" class="map-directions-button">
            <font-awesome-icon :icon="['fas', 'directions']" class="button-icon" size="lg" />
            CÓMO LLEGAR
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const direccion = ref('2RF6+2GH, Alajuela Desamparados de, Provincia de Alajuela, Alajuela');
const telefono = ref('+506 2430 1392');

const mapUrl = computed(() => {
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(direccion.value)}&zoom=15`;
});

const direccionesUrl = computed(() => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccion.value)}`;
});
</script>

<style scoped>
@import "@/assets/styles/landing/ubicacion.css";
</style>
