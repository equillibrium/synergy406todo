<template>
  <div class="todo-app">
    <header class="app-header">
      <h1 class="app-title">
        <span class="todo-icon">✓</span>
        Todo App
      </h1>
      <p class="app-subtitle">Организуйте свои задачи эффективно</p>
    </header>

    <main class="todo-main">
      <!-- Форма добавления задачи -->
      <TodoForm />
      <!-- Фильтры -->
      <TodoFilters />
      <!-- Статистика -->
      <TodoStats />
      <div class="todos-section">
        <!-- Пустое состояние -->
        <EmptyState />
        <!-- Список задач -->
        <TodoList />
      </div>
      <router-link to="/about">О приложении</router-link>
    </main>
  </div>
</template>

<script setup>
import TodoForm from '@/components/TodoForm.vue'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoStats from '@/components/TodoStats.vue'
import EmptyState from '@/components/EmptyState.vue'
import TodoList from '@/components/TodoList.vue'
</script>

<style scoped>
.todo-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.app-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.app-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.todo-main {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgb(0 0 0 / 10%);
  backdrop-filter: blur(10px);
}

.todos-section {
  min-height: 200px;
}

.todo-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #495057;
  line-height: 1.4;
}

/* Адаптивность */
@media (width <= 768px) {
  .todo-app {
    padding: 1rem;
  }

  .app-title {
    font-size: 2rem;
  }

  .todo-main {
    padding: 1.5rem;
  }
}
</style>
