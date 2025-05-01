<template>
  <div class="hero-container">
    <div class="hero-image-container">
      <img src="@/assets/images/imagen-de-la-escuela.png" alt="Escuela Manuela Santamarca" class="hero-image" />
      <div class="hero-overlay">
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
// No refs needed for icons since we're using inline SVGs
</script>

<style scoped>
@import '@/assets/styles/landing/hero.css';
</style>