import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'

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
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'anios/crear',
          name: 'direccion-anios-crear',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'anios/promocionar',
          name: 'direccion-anios-promocionar',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'secciones',
          name: 'direccion-secciones',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'materias',
          name: 'direccion-materias',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'documentos',
          name: 'direccion-documentos',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'avisos',
          name: 'direccion-avisos',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
        {
          path: 'reportes',
          name: 'direccion-reportes',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
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
        {
          path: 'perfil',
          name: 'direccion-perfil',
          component: () => import('@/views/dashboard/direccion/InicioView.vue'), 
        },
      ],
    },
  ],
})

export default router
