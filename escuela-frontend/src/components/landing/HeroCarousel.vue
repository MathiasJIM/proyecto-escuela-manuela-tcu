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
.hero-container {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: visible;
  margin-top: 120px; /* Add space for the fixed navbar */
}

.hero-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.school-badge {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  max-width: 300px;
  box-shadow: var(--shadow-lg);
  position: relative;
  border: 2px solid var(--primary-color);
  overflow: hidden;
}

.school-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background-color: var(--primary-color);
}

.badge-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.badge-content h1 {
  color: var(--primary-color);
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
  margin: 0;
  text-transform: uppercase;
}

.info-boxes {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 0 48px;
  z-index: 10;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.info-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.info-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.info-box-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-box-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  color: var(--primary-color);
}

.info-box h3 {
  color: var(--primary-color);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

@media (max-width: 1024px) {
  .hero-container {
    height: 450px;
    margin-top: 100px; /* Adjust for smaller navbar */
  }
  
  .info-boxes {
    padding: 0 24px;
    gap: 16px;
  }
  
  .info-box {
    padding: 20px;
    max-width: 260px;
  }
}

@media (max-width: 768px) {
  .hero-container {
    height: 400px;
    margin-top: 80px; /* Adjust for even smaller navbar */
    margin-bottom: 200px; /* Add space for stacked info boxes */
  }

  .info-boxes {
    position: relative;
    bottom: -30px;
    padding: 0 16px;
    gap: 12px;
    flex-direction: column;
    align-items: center;
  }

  .info-box {
    width: 90%;
    max-width: 100%;
    margin-bottom: 12px;
  }

  .info-box-icon {
    width: 36px;
    height: 36px;
    margin-bottom: 12px;
  }

  .info-box h3 {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .hero-container {
    height: 300px;
  }

  .info-boxes {
    bottom: -20px;
  }
  
  .info-box {
    max-width: 100%;
    padding: 16px;
  }
}

/* Additional media query for very small screens */
@media (max-width: 360px) {
  .hero-container {
    height: 250px;
    margin-bottom: 240px;
  }
  
  .info-boxes {
    bottom: -10px;
  }
}
</style>