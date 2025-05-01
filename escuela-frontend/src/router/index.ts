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
      ],
    },
    {
      path: '/dashboard',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      children: [
        {
          path: 'profesores/inicio',
          name: 'teacher-dashboard',
          component: () => import('@/components/dashboards/profesores/DashboardHome.vue'),
        },
        {
          path: 'profesores/asistencia',
          name: 'teacher-attendance',
          component: () => import('@/components/dashboards/profesores/AttendanceView.vue'),
        },
        {
          path: 'profesores/calendario',
          name: 'teacher-calendar',
          component: () => import('@/components/dashboards/profesores/CalendarView.vue'),
        },
        {
          path: 'profesores/citas',
          name: 'teacher-appointments',
          component: () => import('@/components/dashboards/profesores/DashboardHome.vue'), // Placeholder
        },
        {
          path: 'profesores/material',
          name: 'teacher-materials',
          component: () => import('@/components/dashboards/profesores/DashboardHome.vue'), // Placeholder
        },
        {
          path: 'profesores/notificaciones',
          name: 'teacher-notifications',
          component: () => import('@/components/dashboards/profesores/DashboardHome.vue'), // Placeholder
        },
        {
          path: 'profesores/perfil',
          name: 'teacher-profile',
          component: () => import('@/components/dashboards/profesores/DashboardHome.vue'), // Placeholder
        },
      ],
    },
  ],
})

export default router
