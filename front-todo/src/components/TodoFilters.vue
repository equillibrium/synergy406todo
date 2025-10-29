<template>
  <!-- Фильтры -->
  <div class="filters-section">
    <div class="filter-buttons">
      <button
        v-for="filterOption in filterOptions"
        :key="filterOption.value"
        @click="todoStore.setFilter(filterOption.value)"
        :class="['filter-btn', { active: todoStore.filter === filterOption.value }]"
      >
        {{ filterOption.label }}
        <span class="count">({{ getFilterCount(filterOption.value) }})</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

const filterOptions = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
]

function getFilterCount(filterValue) {
  switch (filterValue) {
    case 'active':
      return todoStore.activeCount
    case 'completed':
      return todoStore.completedCount
    default:
      return todoStore.todosCount
  }
}
</script>

<style scoped>
.filters-section {
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.count {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
