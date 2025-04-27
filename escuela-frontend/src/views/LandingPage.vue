<template>
  <div class="landing-page">
    <main>
      <section class="hero">
        <HeroCarousel />
      </section>
      
      <section class="about">
        <AboutSchool />
      </section>
      
      <section class="diferencias">
        <DiferenciasSection />
      </section>

      <section class="noticias">
        <NoticiasSection />
      </section>

      <section class="ubicacion">
        <UbicacionSection />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import HeroCarousel from '@/components/landing/HeroCarousel.vue'
import AboutSchool from '@/components/landing/AboutSchool.vue'
import DiferenciasSection from '@/components/landing/DiferenciasSection.vue'
import NoticiasSection from '@/components/landing/NoticiasSection.vue'
import UbicacionSection from '@/components/landing/UbicacionSection.vue'
</script>

<style scoped>
.landing-page {
  width: 100%;
  flex: 1;
}

main {
  width: 100%;
}

section {
  width: 100%;
}

.header {
  background-color: white;
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-image {
  height: 40px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.hero {
  margin-top: 0px;
  width: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.services {
  width: 100%;
  padding: 4rem 0;
  background-color: #f8f9fa;
}

.service-grid {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.service-item {
  text-align: center;
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.about {
  width: 100%;
  background-color: var(--bg-light);
}

.about-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  text-align: center;
}

.about-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.diferencias {
  width: 100%;
  padding: 4rem 0;
  background-color: var(--bg-off-white);
}

.diferencia h2 {
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
}

.diferencia-grid {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.diferencia-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.diferencia-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.diferencia-card h3 {
  padding: 1rem;
  margin: 0;
}

.diferencia-card p {
  padding: 0 1rem 1rem;
  color: #666;
}

.noticias {
  width: 100%;
  background-color: var(--bg-light);
}

.noticias h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.noticias-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

.noticias ul {
  list-style: none;
  padding: 0;
}

.noticias li {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.fecha {
  color: #666;
  font-size: 0.9rem;
}

.ubicacion {
  width: 100%;
  padding-bottom: var(--spacing-3xl);
  background-color: var(--bg-off-white);
}

.ubicacion h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.mapa {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto 2rem;
  padding: 0 48px;
  height: 400px;
}

.mapa-imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.direccion {
  text-align: center;
  color: #666;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .service-grid,
  .diferencia-grid {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }

  .about-content,
  .noticias-content,
  .mapa,
  .direccion {
    padding: 0 24px;
  }
}
</style>
