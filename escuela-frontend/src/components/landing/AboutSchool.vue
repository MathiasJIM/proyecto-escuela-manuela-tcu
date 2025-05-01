<template>
  <div class="about-school-section">
    <div class="about-content">
      <div class="about-text">
        <div class="costa-rica-icon">
          <img src="@/assets/images/mep-logo.webp" alt="Costa Rica" class="cr-icon" />
        </div>
        <h2 class="about-title">
          En la escuela Manuela<br />
          Santamaria Rodriguez
        </h2>
        <p class="about-description">
          Brindar una educación integral y de calidad que promueva el desarrollo académico,
          emocional y social de nuestros estudiantes, fomentando valores como el respeto, la
          responsabilidad y la solidaridad, en un ambiente inclusivo, seguro y colaborativo que
          involucre activamente a las familias y a la comunidad educativa.
        </p>
      </div>

      <div class="about-images">
        <div class="main-image">
          <img src="@/assets/images/escuela-image1.webp" alt="Escuela Manuela Santamaria" />
        </div>
        <div class="image-grid">
          <img src="@/assets/images/escuela-ninos.jpg" alt="Estudiantes" class="grid-image" />
          <img
            src="@/assets/images/escuela-ninos1.webp"
            alt="Actividades escolares"
            class="grid-image"
          />
          <img
            src="@/assets/images/escuela-ninos3.webp"
            alt="Estudiantes en clase"
            class="grid-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>

<style scoped>
@import '@/assets/styles/landing/about.css';
</style>
