<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section contact-section">
        <h3>Contáctenos</h3>
        <div class="contact-item">
          <div class="contact-icon">
            <font-awesome-icon :icon="['far', 'building']" size="lg" class="text-secondary" />
          </div>
          <div class="contact-text">
            <p>Escuela Manuela Santamaría</p>
            <p>2RF6+2GH, Alajuela Desamparados de, Provincia de Alajuela, Alajuela</p>
          </div>
        </div>
        
        <div class="contact-item">
          <div class="contact-icon">
            <font-awesome-icon :icon="['fas', 'phone']" size="lg" class="text-secondary" transform="rotate--10" />
          </div>
          <div class="contact-text">
            <p>+506 2430 1392</p>
          </div>
        </div>
        
        <div class="contact-item">
          <div class="contact-icon">
            <font-awesome-icon :icon="['far', 'envelope']" size="lg" class="text-secondary" />
          </div>
          <div class="contact-text">
            <p>info@escuelamanuela.ed.cr</p>
          </div>
        </div>
      </div>
      
      <div class="footer-section social-section">
        <h3>Síguenos</h3>
        <div class="social-icons">
          <a href="https://www.facebook.com/p/Escuela-Manuela-Santamar%C3%ADa-Rodr%C3%ADguez-100064835552697/" target="_blank" class="social-icon facebook-icon" aria-label="Facebook">
            <font-awesome-icon :icon="['fab', 'facebook']" size="lg" />
          </a>
        </div>
        <p class="social-text">Visita nuestra página de Facebook para mantenerte al día con nuestras actividades y noticias.</p>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© {{ currentYear }} Escuela Manuela Santamaría. Todos los derechos reservados.</p>
      <a href="#" class="privacy-policy">Política de Privacidad</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped>
@import '@/assets/styles/landing/footer.css';
</style>
