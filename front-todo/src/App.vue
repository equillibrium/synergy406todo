<template>
  <div id="app">
    <!-- Header с навигацией (только для авторизованных) -->
    <header v-if="authStore.isAuthenticated" class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-logo">📝 Todo App</h1>
        </div>

        <nav class="header-nav">
          <router-link to="/" class="nav-link" active-class="nav-link-active"> Задачи </router-link>
          <router-link to="/about" class="nav-link" active-class="nav-link-active">
            О проекте
          </router-link>
        </nav>

        <div class="header-right">
          <div class="user-info">
            <span class="user-name">{{ authStore.userName }}</span>
            <button @click="handleLogout" class="btn-logout">Выйти</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

onMounted(async () => {
  // Инициализируем авторизацию при загрузке приложения
  authStore.initializeAuth()

  // Если пользователь авторизован, загружаем его задачи
  if (authStore.isAuthenticated) {
    await todoStore.fetchTodos()
  }
})

const handleLogout = async () => {
  await authStore.logout()
  todoStore.clearTodos()
  router.push('/login')
}
</script>

<style>
/* Глобальные стили перенесены в main.css */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.header-left {
  flex-shrink: 0;
}

.app-logo {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.header-nav {
  display: flex;
  gap: 8px;
  flex: 1;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f7fafc;
  color: #667eea;
}

.nav-link-active {
  background-color: #667eea;
  color: white;
}

.header-right {
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.btn-logout {
  padding: 8px 16px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #fed7d7;
  border-color: #fc8181;
  color: #c53030;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    padding: 12px 16px;
  }

  .header-nav {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }

  .user-name {
    display: none;
  }
}
</style>
