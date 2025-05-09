<template>
  <div class="inicio-direccion">
    <h1 class="page-title">Dashboard de Dirección</h1>
    <div class="dashboard-content">
      <div class="welcome-card">
        <h2>Bienvenido/a al Portal de Dirección</h2>
        <p>Desde aquí podrá gestionar todos los aspectos administrativos de la escuela.</p>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="fa-user-tie" />
          </div>
          <div class="stat-info">
            <h3>Profesores</h3>
            <p class="stat-value">12</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="fa-graduation-cap" />
          </div>
          <div class="stat-info">
            <h3>Estudiantes</h3>
            <p class="stat-value">245</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="fa-users" />
          </div>
          <div class="stat-info">
            <h3>Padres</h3>
            <p class="stat-value">180</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <font-awesome-icon icon="fa-book-open" />
          </div>
          <div class="stat-info">
            <h3>Materias</h3>
            <p class="stat-value">18</p>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <button class="action-button">
            <font-awesome-icon icon="fa-user-plus" />
            <span>Nuevo Profesor</span>
          </button>
          <button class="action-button">
            <font-awesome-icon icon="fa-user-graduate" />
            <span>Nuevo Estudiante</span>
          </button>
          <button class="action-button">
            <font-awesome-icon icon="fa-bullhorn" />
            <span>Crear Aviso</span>
          </button>
          <button class="action-button">
            <font-awesome-icon icon="fa-file-alt" />
            <span>Generar Reporte</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Aquí iría la lógica del componente
</script>

<style scoped>
.inicio-direccion {
  padding: var(--spacing-lg);
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color-dark);
  margin-bottom: var(--spacing-lg);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.welcome-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.welcome-card h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  margin-right: var(--spacing-md);
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-color-muted);
  margin: 0;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color-dark);
  margin: 0;
}

.quick-actions {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.quick-actions h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: var(--spacing-md);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-button:hover {
  background-color: var(--primary-color);
  color: white;
}

.action-button svg {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
  
  .actions-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
}
</style>
