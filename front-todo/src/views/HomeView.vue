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
      <div class="add-todo-section">
        <form @submit.prevent="todoStore.addTodo()" class="add-todo-form">
          <div class="input-group">
            <input
              v-model="todoStore.newTodoTitle"
              type="text"
              placeholder="Добавить новую задачу..."
              class="todo-input"
              maxlength="100"
            />
            <div class="priority-buttons">
              <button
                v-for="priority in priorityOptions"
                :key="priority.value"
                type="button"
                @click="todoStore.newTodoPriority = priority.value"
                :class="[
                  'priority-btn',
                  `priority-${priority.value}`,
                  { active: todoStore.newTodoPriority === priority.value },
                ]"
              >
                {{ priority.label }}
              </button>
            </div>
            <button type="submit" class="add-button" :disabled="!todoStore.newTodoTitle.trim()">
              <span class="add-icon">+</span>
              Добавить
            </button>
          </div>
        </form>
      </div>

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

      <!-- Статистика -->
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

      <!-- Список задач -->
      <div class="todos-section">
        <div v-if="todoStore.filteredTodos.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <p class="empty-text">
            {{ getEmptyStateText() }}
          </p>
        </div>

        <div v-else class="todos-list">
          <div
            v-for="todo in todoStore.filteredTodos"
            :key="todo.id"
            :class="['todo-item', { completed: todo.completed }]"
          >
            <div class="todo-content">
              <button
                @click="todoStore.toggleTodo(todo.id)"
                :class="['todo-checkbox', { checked: todo.completed }]"
              >
                <span v-if="todo.completed" class="checkmark">✓</span>
              </button>

              <div class="todo-text">
                <span class="todo-title">{{ todo.title }}</span>
                <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
              </div>

              <div class="todo-priority" :class="`priority-${todo.priority}`">
                {{ getPriorityLabel(todo.priority) }}
              </div>
            </div>

            <button
              @click="todoStore.deleteTodo(todo.id)"
              class="delete-btn"
              title="Удалить задачу"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todo'
import { ref } from 'vue'

const importInput = ref(null)

function triggerImport() {
  importInput.value?.click()
}

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

function getPriorityLabel(priority) {
  const labels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  }
  return labels[priority] || 'Средний'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
]
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

.todo-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 50%;
  backdrop-filter: blur(10px);
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.add-todo-section {
  margin-bottom: 2rem;
}

.add-todo-form {
  width: 100%;
}

.input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.todo-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

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

.todos-section {
  min-height: 200px;
}

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

.todos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.todo-item:hover {
  border-color: #667eea;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.todo-item.completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: #6c757d;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.todo-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.todo-checkbox:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.todo-checkbox.checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.checkmark {
  font-size: 14px;
  font-weight: bold;
}

.todo-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.todo-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #495057;
  line-height: 1.4;
}

.todo-date {
  font-size: 0.85rem;
  color: #6c757d;
}

.todo-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-high {
  background: #fee;
  color: #dc3545;
  border: 1px solid #f5c6cb;
}

.priority-medium {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.priority-low {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.delete-btn:hover {
  background: #fee;
  opacity: 1;
  transform: scale(1.1);
}

/* Адаптивность */
@media (max-width: 768px) {
  .todo-app {
    padding: 1rem;
  }

  .app-title {
    font-size: 2rem;
  }

  .todo-main {
    padding: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }

  .stats {
    gap: 1rem;
  }

  .todo-item {
    padding: 1rem;
  }

  .todo-content {
    gap: 0.75rem;
  }
}

.priority-buttons {
  display: flex;
  gap: 0.5rem;
}

.priority-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.priority-btn:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.priority-btn.active {
  border-color: transparent;
  color: white;
}

.priority-btn.priority-low.active {
  background: #17a2b8;
}

.priority-btn.priority-medium.active {
  background: #ffc107;
  color: #212529;
}

.priority-btn.priority-high.active {
  background: #dc3545;
}

.stats-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
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
</style>
