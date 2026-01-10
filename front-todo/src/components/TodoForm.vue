<template>
  <div class="add-todo-section">
    <form @submit.prevent="handleAddTodo" class="add-todo-form">
      <div class="input-group">
        <textarea
          v-model="newTodoTitle"
          placeholder="Добавить новую задачу..."
          class="todo-input"
          maxlength="500"
          rows="1"
          @input="autoResize"
        />
        <div class="priority-buttons">
          <button
            v-for="priority in priorityOptions"
            :key="priority.value"
            type="button"
            @click="newTodoPriority = priority.value"
            :class="[
              'priority-btn',
              `priority-${priority.value}`,
              { active: newTodoPriority === priority.value },
            ]"
          >
            {{ priority.label }}
          </button>
        </div>
        <button
          type="submit"
          class="add-button"
          :disabled="!newTodoTitle.trim() || todoStore.loading"
        >
          <span v-if="!todoStore.loading">
            <span class="add-icon">+</span>
            Добавить
          </span>
          <span v-else>Добавление...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

// Локальное состояние формы
const newTodoTitle = ref('')
const newTodoPriority = ref('medium')

const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
]

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    await todoStore.addTodo(newTodoTitle.value, newTodoPriority.value)
    // Очищаем форму после успешного добавления
    newTodoTitle.value = ''
    newTodoPriority.value = 'medium'
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

const autoResize = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
</script>

<style scoped>
.add-todo-section {
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  resize: none;
  overflow-y: hidden;
  min-height: 48px;
  font-family: inherit;
  line-height: 1.4;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgb(102 126 234 / 10%);
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
  white-space: nowrap;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgb(102 126 234 / 30%);
}

.add-icon {
  font-size: 1.2rem;
  font-weight: bold;
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

/* Адаптивность */
@media (width <= 768px) {
  .input-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .todo-input {
    width: 100%;
    font-size: 0.95rem;
    padding: 0.875rem 1rem;
  }

  .priority-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .priority-btn {
    flex: 1;
    padding: 0.6rem 0.5rem;
    font-size: 0.85rem;
  }

  .add-button {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }
}

/* Для очень маленьких экранов */
@media (width <= 375px) {
  .add-todo-section {
    padding: 1rem;
  }

  .todo-input {
    font-size: 0.9rem;
    padding: 0.75rem 0.875rem;
  }

  .priority-btn {
    font-size: 0.8rem;
    padding: 0.5rem 0.25rem;
  }
}
</style>
