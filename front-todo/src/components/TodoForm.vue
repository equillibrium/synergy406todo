<template>
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
</template>

<script setup>
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
]
</script>

<style scoped>
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

.todo-icon {
  font-size: 2.5rem;
  background: rgb(255 255 255 / 20%);
  padding: 0.5rem;
  border-radius: 50%;
  backdrop-filter: blur(10px);
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
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
