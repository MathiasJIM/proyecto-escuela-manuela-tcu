import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import AuthService from '@/services/auth.service'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'landing',
          component: LandingPage,
        },
        {
          path: 'junta-patronato',
          name: 'junta-patronato',
          component: () => import('@/views/pages/JuntaPatronatoView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/components/layout/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: 'crear-cuenta',
          name: 'register',
          component: () => import('@/views/RegisterView.vue'),
        },
        {
          path: 'cambiar-contrasena',
          name: 'change-password',
          component: () => import('@/views/CambiarPasswordView.vue'),
        },
      ],
    },
    {
      path: '/dashboard',
      component: () => import('@/views/dashboard/profesores/ProfesoresLayout.vue'),
      meta: { requiresAuth: true, role: 'profesor' },
      beforeEnter: (to, from, next) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser || currentUser.rol !== 'profesor') {
          next({ name: 'login' });
        } else {
          next();
        }
      },
      children: [
        {
          path: 'profesores/inicio',
          name: 'teacher-dashboard',
          component: () => import('@/views/dashboard/profesores/InicioView.vue'),
        },
        {
          path: 'profesores/asistencia',
          name: 'teacher-attendance',
          component: () => import('@/views/dashboard/profesores/AttendanceView.vue'),
        },
        {
          path: 'profesores/calendario',
          name: 'teacher-calendar',
          component: () => import('@/views/dashboard/profesores/CalendarView.vue'),
        },
        {
          path: 'profesores/citas',
          name: 'teacher-appointments',
          component: () => import('@/views/dashboard/profesores/CitasView.vue'),
        },
        {
          path: 'profesores/material',
          name: 'teacher-materials',
          component: () => import('@/views/dashboard/profesores/MaterialView.vue'),
        },
        {
          path: 'profesores/notificaciones',
          name: 'teacher-notifications',
          component: () => import('@/views/dashboard/profesores/NotificacionesView.vue'),
        },
        {
          path: 'profesores/perfil',
          name: 'teacher-profile',
          component: () => import('@/views/dashboard/profesores/PerfilView.vue'),
        },
      ],
    },
    {
      path: '/dashboard/direccion',
      component: () => import('@/views/dashboard/direccion/DireccionLayout.vue'),
      meta: { requiresAuth: true, role: 'direccion' },
      beforeEnter: (to, from, next) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser || currentUser.rol !== 'direccion') {
          next({ name: 'login' });
        } else {
          next();
        }
      },
      children: [
        {
          path: 'inicio',
          name: 'direccion-inicio',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'),
        },
        {
          path: 'usuarios/profesores',
          name: 'direccion-profesores',
          component: () => import('@/views/dashboard/direccion/GestiónProfesoresView.vue'),
        },
        {
          path: 'usuarios/estudiantes',
          name: 'direccion-estudiantes',
          component: () => import('@/views/dashboard/direccion/GestionEstudiantesView.vue'),
        },
        {
          path: 'usuarios/padres',
          name: 'direccion-padres',
          component: () => import('@/views/dashboard/direccion/GestionPadresView.vue'),
        },
        {
          path: 'anios/ver',
          name: 'direccion-anios-ver',
          component: () => import('@/views/dashboard/direccion/VerAniosView.vue'),
        },
        {
          path: 'anios/crear',
          name: 'direccion-anios-crear',
          component: () => import('@/views/dashboard/direccion/CrearAnioView.vue'),
        },
        {
          path: 'anios/promocionar',
          name: 'direccion-anios-promocionar',
          component: () => import('@/views/dashboard/direccion/PromocionarEstudiantesView.vue'),
        },
        {
          path: 'secciones',
          name: 'direccion-secciones',
          component: () => import('@/views/dashboard/direccion/SeccionesView.vue'),
        },
        {
          path: 'materias',
          name: 'direccion-materias',
          component: () => import('@/views/dashboard/direccion/MateriasView.vue'),
        },
        {
          path: 'horarios',
          children: [
            {
              path: '',
              redirect: { name: 'direccion-horarios-ver' },
            },
            {
              path: 'ver',
              name: 'direccion-horarios-ver',
              component: () => import('@/views/dashboard/direccion/VerHorarioView.vue'),
            },
            {
              path: 'gestion',
              name: 'direccion-horarios-gestion',
              component: () => import('@/views/dashboard/direccion/GestionHorario.vue'),
            },
          ],
        },
        {
          path: 'documentos',
          name: 'direccion-documentos',
          component: () => import('@/views/dashboard/direccion/DocumentosView.vue'),
        },
        {
          path: 'avisos',
          name: 'direccion-avisos',
          component: () => import('@/views/dashboard/direccion/AvisosView.vue'),
        },
        {
          path: 'perfil',
          name: 'direccion-perfil',
          component: () => import('@/views/dashboard/direccion/PerfilUsuarioView.vue'),
        },
        {
          path: 'reportes',
          name: 'direccion-reportes',
          component: () => import('@/views/dashboard/direccion/ReportesView.vue'),
        },
        {
          path: 'calendario',
          name: 'direccion-calendario',
          component: () => import('@/views/dashboard/direccion/CalendarView.vue'),
        },
        {
          path: 'notificaciones',
          name: 'direccion-notificaciones',
          component: () => import('@/views/dashboard/direccion/NotificacionesView.vue'),
        },
      ],
    },
  ],
})

// Guardia de navegación global para proteger rutas
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
    next({ name: 'login' });
  } else {
    // En otros casos, permitir la navegación
    next();
  }
});

export default router
