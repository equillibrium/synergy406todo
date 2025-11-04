<template>
  <!-- Список задач -->
  <div v-if="todoStore.filteredTodos.length === 0" class="empty-state">
    <div class="empty-icon">📝</div>
    <p class="empty-text">
      {{ getEmptyStateText() }}
    </p>
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

function getEmptyStateText() {
  switch (todoStore.filter) {
    case 'active':
      return 'Нет активных задач'
    case 'completed':
      return 'Нет выполненных задач'
    default:
      return 'Добавьте свою первую задачу!'
  }
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.2rem;
  margin: 0;
}
</style>
