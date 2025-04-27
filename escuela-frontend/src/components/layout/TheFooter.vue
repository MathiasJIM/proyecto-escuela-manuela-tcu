<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section contact-section">
        <h3>Contáctenos</h3>
        <div class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="contact-text">
            <p>Escuela Manuela Santamaría</p>
            <p>2RF6+2GH, Alajuela Desamparados de, Provincia de Alajuela, Alajuela</p>
          </div>
        </div>
        
        <div class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div class="contact-text">
            <p>+506 2430 1392</p>
          </div>
        </div>
        
        <div class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
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
.footer {
  background-color: var(--primary-color);
  color: #ffffff;
  padding: 0;
  width: 100%;
  margin-top: auto;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-xl);
  gap: var(--spacing-2xl);
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.contact-section h3,
.social-section h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
  position: relative;
  padding-bottom: var(--spacing-sm);
}

.contact-section h3::after,
.social-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: var(--secondary-color);
}

.contact-item {
  display: flex;
  margin-bottom: 1.25rem;
  align-items: flex-start;
}

.contact-icon {
  margin-right: var(--spacing-sm);
  margin-top: var(--spacing-xs);
  color: var(--secondary-color);
}

.contact-text p {
  margin: 0;
  line-height: 1.5;
}

.contact-text p:first-child {
  font-weight: 600;
}

.social-icons {
  display: flex;
  margin-bottom: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all var(--transition-normal);
}

.facebook-icon:hover {
  background-color: #1877F2;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.social-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.footer-bottom {
  background-color: var(--primary-dark);
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.footer-bottom p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.privacy-policy {
  color: #ffffff;
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.privacy-policy:hover {
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
}
</style>
