<template>
  <div class="diferencias-section">
    <div class="diferencias-content">
      <h2 class="section-title">Que Nos Diferencia?</h2>

      <div class="cards-container">
        <!-- Tarjeta 1 -->
        <div class="card">
          <div class="card-image">
            <img src="@/assets/images/escuela-ninos.jpg" alt="Comunidad educativa" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Gran comunidad educativa</h3>
            <p class="card-description">
              La escuel acuenta con actividades que hacen que los estudiantes la pase super y que
              desarrolles sus habilidades
            </p>
          </div>
        </div>

        <!-- Tarjeta 2 -->
        <div class="card card-reverse">
          <div class="card-image">
            <img src="@/assets/images/escuela-ninos1.webp" alt="Comunidad educativa" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Gran comunidad educativa</h3>
            <p class="card-description">
              La escuel acuenta con actividades que hacen que los estudiantes la pase super y que
              desarrolles sus habilidades
            </p>
          </div>
        </div>

        <!-- Tarjeta 3 -->
        <div class="card">
          <div class="card-image">
            <img src="@/assets/images/escuela-ninos3.webp" alt="Comunidad educativa" />
          </div>
          <div class="card-content">
            <h3 class="card-title">Gran comunidad educativa</h3>
            <p class="card-description">
              La escuel acuenta con actividades que hacen que los estudiantes la pase super y que
              desarrolles sus habilidades
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>

<style scoped>
.diferencias-section {
  width: 100%;
  padding: var(--spacing-3xl) 0;
  background-color: var(--bg-off-white);
}

.diferencias-content {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-dark);
  margin-bottom: var(--spacing-2xl);
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.card {
  display: flex;
  align-items: center;
  width: 100%;
}

.card-reverse {
  flex-direction: row-reverse;
}

.card-image {
  flex: 1;
  height: 300px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.card:hover .card-image {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 1;
  padding: 32px;
  border-radius: 8px;
}

.card-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.card-description {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--text-medium);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .diferencias-content {
    padding: 0 24px;
  }


  .card-image {
    height: 260px;
  }

  .card-content {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .diferencias-section {
    padding: 10px 0 60px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 36px;
  }

  .card,
  .card-reverse {
    flex-direction: column;
    gap: 24px;
  }

  .card-image {
    width: 100%;
    height: 240px;
  }

  .card-content {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .diferencias-section {
    padding: 40px 0 40px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .cards-container {
    gap: 40px;
  }

  .card-image {
    height: 200px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 14px;
  }
}
</style>
