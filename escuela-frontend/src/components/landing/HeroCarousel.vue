<template>
  <div class="hero-container">
    <div class="hero-image-container">
      <!-- Imagen actual visible -->
      <img 
        v-for="(image, index) in images" 
        :key="index"
        :src="getImageUrl(image)" 
        :alt="`Escuela Manuela Santamarca - Imagen ${index + 1}`" 
        class="hero-image" 
        :class="{ 'active': index === currentImageIndex }" 
      />
      <div class="hero-overlay">
        <div class="carousel-indicators">
          <span 
            v-for="(image, index) in images" 
            :key="index" 
            class="indicator" 
            :class="{ active: index === currentImageIndex }" 
            @click="setCurrentImage(index)"
          ></span>
        </div>
      </div>
    </div>
    
    <div class="info-boxes">
      <div class="info-box">
        <div class="info-box-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
            <path d="M18 14h-8"></path>
            <path d="M18 18h-8"></path>
            <path d="M18 10h-8"></path>
            <path d="M18 6h-8"></path>
          </svg>
        </div>
        <h3>Ultimas Noticias</h3>
      </div>
      
      <div class="info-box">
        <div class="info-box-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <h3>Ubicación</h3>
      </div>
      
      <div class="info-box">
        <div class="info-box-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <h3>Quienes Somos</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Importar imágenes estáticamente
import imagenEscuela from '@/assets/images/imagen-de-la-escuela.png';
import escuelaImage1 from '@/assets/images/escuela-image1.webp';
import escuelaImage2 from '@/assets/images/escuela-image2.webp';
import escuelaNinos from '@/assets/images/escuela-ninos.jpg';
import escuelaNinos1 from '@/assets/images/escuela-ninos1.webp';

// Array de imágenes para el carrusel
const images = [
  'imagen-de-la-escuela.png',
  'escuela-image1.webp',
  'escuela-image2.webp',
  'escuela-ninos.jpg',
  'escuela-ninos1.webp'
];

// Mapeo de nombres de archivo a importaciones
const imageMap: Record<string, string> = {
  'imagen-de-la-escuela.png': imagenEscuela,
  'escuela-image1.webp': escuelaImage1,
  'escuela-image2.webp': escuelaImage2,
  'escuela-ninos.jpg': escuelaNinos,
  'escuela-ninos1.webp': escuelaNinos1
};

// Función para obtener la URL de la imagen
const getImageUrl = (imageName: string): string => {
  return imageMap[imageName];
};

const currentImageIndex = ref(0);
let intervalId: number | null = null;

// Función para cambiar a la siguiente imagen
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
};

// Función para establecer una imagen específica
const setCurrentImage = (index: number) => {
  currentImageIndex.value = index;
  // Reiniciar el temporizador cuando se cambia manualmente
  if (intervalId !== null) {
    clearInterval(intervalId);
    startCarousel();
  }
};

// Función para iniciar el carrusel automático
const startCarousel = () => {
  intervalId = window.setInterval(() => {
    nextImage();
  }, 10000); // Cambiar cada 10 segundos
};

// Iniciar el carrusel cuando el componente se monta
onMounted(() => {
  startCarousel();
});

// Limpiar el intervalo cuando el componente se desmonta
onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
@import '@/assets/styles/landing/hero.css';
</style>