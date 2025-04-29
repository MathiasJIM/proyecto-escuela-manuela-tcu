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
  ],
})

export default router
