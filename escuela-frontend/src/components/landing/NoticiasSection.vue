<template>
  <div class="noticias-section">
    <div class="noticias-container">
      <div class="section-header">
        <h2>Ultimas Noticias</h2>
      </div>
      
      <div class="noticias-list">
        <div class="noticia-item" v-for="(noticia, index) in noticias" :key="index">
          <div class="noticia-date">{{ noticia.fecha }}</div>
          <h3 class="noticia-title">{{ noticia.titulo }}</h3>
          <p class="noticia-description">{{ noticia.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Datos de noticias de ejemplo (serán reemplazados por datos reales en el futuro)
const noticias = ref([
  {
    fecha: '15 de abril de 2025',
    titulo: 'Proyecto Ambiental Gana Premio Nacional',
    descripcion: 'Nuestros estudiantes de sexto grado recibieron reconocimiento nacional por su innovador proyecto de reciclaje implementado en la escuela.'
  },
  {
    fecha: '2 de marzo de 2025',
    titulo: 'Nueva Biblioteca Digital',
    descripcion: 'Anunciamos la apertura de nuestra biblioteca digital con acceso a más de 5,000 libros y recursos educativos para todos los estudiantes.'
  },
  {
    fecha: '18 de enero de 2025',
    titulo: 'Intercambio Cultural con Escuelas Internacionales',
    descripcion: 'Un programa de intercambio virtual conectará a nuestros estudiantes con niños de escuelas en España y Argentina este semestre.'
  }
]);
</script>

<style scoped>
@import '@/assets/styles/landing/noticias.css';
</style>
