import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation guard для проверки авторизации
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Инициализируем auth store если еще не инициализирован
  if (!authStore.user && localStorage.getItem('accessToken')) {
    authStore.initializeAuth()
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some((record) => record.meta.guest)

  // Если маршрут требует авторизации и пользователь не авторизован
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  }
  // Если пользователь авторизован и пытается попасть на страницы login/register
  else if (isGuestRoute && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  // В остальных случаях пропускаем
  else {
    next()
  }
})

export default router
