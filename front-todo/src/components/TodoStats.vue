<template>
  <div class="stats-section">
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">Всего:</span>
        <span class="stat-value">{{ todoStore.todosCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Активных:</span>
        <span class="stat-value">{{ todoStore.activeCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Выполнено:</span>
        <span class="stat-value">{{ todoStore.completedCount }}</span>
      </div>
    </div>
    <div class="stats-actions">
      <button
        v-if="todoStore.completedCount > 0"
        @click="todoStore.clearCompleted()"
        class="clear-completed-btn"
      >
        Очистить выполненные
      </button>
      <button @click="todoStore.exportData()" class="export-btn" title="Экспортировать данные">
        📤 Экспорт
      </button>
      <button @click="triggerImport" class="import-btn" title="Импортировать данные">
        📥 Импорт
      </button>
      <input
        ref="importInput"
        type="file"
        accept=".json"
        @change="handleImport"
        style="display: none"
      />
    </div>
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todo'
import { ref } from 'vue'

const todoStore = useTodoStore()
const importInput = ref(null)

// Импорт данных
async function handleImport(event) {
  const file = event.target.files[0]
  if (file) {
    try {
      await todoStore.importData(file)
      alert('Данные успешно импортированы!')
    } catch (error) {
      alert(`Ошибка импорта: ${error}`)
    }
    // Очищаем input
    event.target.value = ''
  }
}

function triggerImport() {
  importInput.value?.click()
}
</script>

<style scoped>
.stats-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 1rem;
}

.stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #495057;
}

.stats-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.clear-completed-btn {
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-completed-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.export-btn,
.import-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.export-btn:hover {
  border-color: #28a745;
  background: #f8fff9;
  color: #28a745;
}

.import-btn:hover {
  border-color: #007bff;
  background: #f8f9ff;
  color: #007bff;
}

/* Адаптивность */
@media (width <= 768px) {
  .stats {
    gap: 1rem;
  }
}
</style>
