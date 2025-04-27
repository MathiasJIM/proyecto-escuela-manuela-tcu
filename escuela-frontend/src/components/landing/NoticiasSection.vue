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
.noticias-section {
  padding: var(--spacing-3xl) 0;
  background-color: var(--bg-light);
}

.noticias-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  position: relative;
}

h2 {
  color: var(--text-dark);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
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

.noticias-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.noticia-item {
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: var(--transition-normal);
}

.noticia-item:hover {
  transform: translateY(-3px);
}

.noticia-item:last-child {
  border-bottom: none;
}

.noticia-date {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  margin-bottom: var(--spacing-sm);
}

.noticia-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
  transition: var(--transition-fast);
}

.noticia-item:hover .noticia-title {
  color: var(--secondary-color);
}

.noticia-description {
  color: var(--text-medium);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .noticias-container {
    padding: 0 var(--spacing-md);
  }
  
  .section-header h2 {
    font-size: var(--font-size-2xl);
  }
  
  .noticia-title {
    font-size: var(--font-size-lg);
  }
  
  .noticia-description {
    font-size: var(--font-size-sm);
  }
}
</style>
