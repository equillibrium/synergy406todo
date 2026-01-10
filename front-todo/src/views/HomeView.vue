<template>
  <div class="home-view">
    <div class="container">
      <!-- Todo Form -->
      <TodoForm />

      <!-- Filters -->
      <TodoFilters />

      <!-- Loading state -->
      <div v-if="todoStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка задач...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="todoStore.error" class="error-state">
        <p>{{ todoStore.error }}</p>
        <button @click="todoStore.fetchTodos()" class="btn-retry">Попробовать снова</button>
      </div>
      <!-- Stats -->
      <TodoStats />
      <!-- Todo List -->
      <TodoList v-if="!todoStore.loading && !todoStore.error" />

      
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoForm from '@/components/TodoForm.vue'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoList from '@/components/TodoList.vue'
import TodoStats from '@/components/TodoStats.vue'

const todoStore = useTodoStore()

onMounted(async () => {
  // Загружаем задачи при монтировании компонента
  if (todoStore.todos.length === 0) {
    await todoStore.fetchTodos()
  }
})
</script>

<style scoped>
.home-view {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  margin: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #718096;
  font-size: 16px;
  margin: 0;
}

.error-state p {
  color: #c53030;
  font-size: 16px;
  margin: 0 0 16px 0;
}

.btn-retry {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
