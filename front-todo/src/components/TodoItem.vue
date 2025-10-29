<template>
  <div :class="['todo-item', { completed: todo.completed }]">
    <div class="todo-content">
      <button
        @click="todoStore.toggleTodo(todo.id)"
        :class="['todo-checkbox', { checked: todo.completed }]"
      >
        <span v-if="todo.completed" class="checkmark">✓</span>
      </button>

      <!-- Режим просмотра -->
      <div v-if="!isEditing" class="todo-text">
        <span class="todo-title">{{ todo.title }}</span>
        <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
      </div>

      <!-- Режим редактирования -->
      <div v-else class="todo-edit">
        <textarea
          v-model="editedTitle"
          class="edit-input"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          ref="editInput"
          maxlength="500"
          rows="2"
        />
        <select v-model="editedPriority" class="priority-select">
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>

      <div class="todo-priority" :class="`priority-${todo.priority}`">
        {{ getPriorityLabel(todo.priority) }}
      </div>
    </div>

    <div class="todo-actions">
      <!-- Кнопки в режиме просмотра -->
      <template v-if="!isEditing">
        <button @click="startEdit" class="edit-btn" title="Редактировать задачу">✏️</button>
        <button @click="todoStore.deleteTodo(todo.id)" class="delete-btn" title="Удалить задачу">
          🗑️
        </button>
      </template>

      <!-- Кнопки в режиме редактирования -->
      <template v-else>
        <button @click="saveEdit" class="save-btn" title="Сохранить">✓</button>
        <button @click="cancelEdit" class="cancel-btn" title="Отменить">✕</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useTodoStore } from '@/stores/todo'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const todoStore = useTodoStore()

// Состояние редактирования
const isEditing = ref(false)
const editedTitle = ref('')
const editInput = ref(null)
const editedPriority = ref('')

// Функции для работы с редактированием
function startEdit() {
  isEditing.value = true
  editedTitle.value = props.todo.title
  editedPriority.value = props.todo.priority
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

function saveEdit() {
  const trimmedTitle = editedTitle.value.trim()
  if (trimmedTitle) {
    todoStore.updateTodo(props.todo.id, {
      title: trimmedTitle,
      priority: editedPriority.value,
    })
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  editedTitle.value = ''
}

// Вспомогательные функции
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
</script>

<style scoped>
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
}

.todo-item:hover {
  border-color: #667eea;
  box-shadow: 0 5px 15px rgb(102 126 234 / 10%);
  transform: translateY(-2px);
}

.todo-item.completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.todo-title {
  /* stylelint-disable-next-line declaration-property-value-keyword-no-deprecated */
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.4;
  max-width: 100%;
  white-space: pre-wrap;
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
  min-width: 0;
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

.todo-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.todo-date {
  font-size: 0.85rem;
  color: #6c757d;
}

.checkmark {
  font-size: 14px;
  font-weight: bold;
}

/* Стили для режима редактирования */
.todo-edit {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}

.edit-input {
  width: 100%;
  min-width: 0;
  padding: 0.5rem 1rem;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
  resize: vertical;
  min-height: 40px;
  font-family: inherit;
  line-height: 1.4;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(102 126 234 / 10%);
}

.todo-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
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

.todo-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
}

.edit-btn,
.delete-btn,
.save-btn,
.cancel-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.edit-btn:hover {
  background: #e3f2fd;
  opacity: 1;
  transform: scale(1.1);
}

.delete-btn:hover {
  background: #fee;
  opacity: 1;
  transform: scale(1.1);
}

.save-btn {
  background: #d4edda;
  color: #155724;
  font-weight: bold;
  opacity: 1;
}

.save-btn:hover {
  background: #c3e6cb;
  transform: scale(1.1);
}

.cancel-btn {
  background: #f8d7da;
  color: #721c24;
  font-weight: bold;
  opacity: 1;
}

.cancel-btn:hover {
  background: #f5c6cb;
  transform: scale(1.1);
}

/* Адаптивность для планшетов */
@media (width <= 768px) {
  .todo-item {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .todo-content {
    gap: 0.75rem;
    flex: 1 1 100%;
  }

  .todo-priority {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }

  .todo-actions {
    gap: 0.25rem;
  }

  .edit-btn,
  .delete-btn,
  .save-btn,
  .cancel-btn {
    font-size: 1rem;
    padding: 0.4rem;
  }
}

/* Адаптивность для мобильных телефонов */
@media (width <= 480px) {
  .todo-item {
    padding: 0.75rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .todo-content {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  /* Чекбокс и текст на одной линии */
  .todo-checkbox {
    align-self: flex-start;
    margin-top: 0.2rem;
  }

  .todo-text {
    flex: 1;
  }

  /* Режим редактирования на полную ширину */
  .todo-edit {
    flex: 1 1 100%;
    width: 100%;
  }

  .edit-input {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }

  /* Приоритет на новой строке */
  .todo-priority {
    flex: 0 0 auto;
    margin-left: 2rem;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }

  /* Кнопки действий справа или внизу */
  .todo-actions {
    width: 100%;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .edit-btn,
  .delete-btn,
  .save-btn,
  .cancel-btn {
    font-size: 1.1rem;
    padding: 0.5rem 0.75rem;
  }
}

.priority-select {
  padding: 0.6rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  background: white;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  margin-left: 0.5rem;
  min-width: 120px;
}

.priority-select:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgb(102 126 234 / 15%);
}

.priority-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgb(102 126 234 / 10%);
  background: #f8f9ff;
}

/* Для очень маленьких экранов */
@media (width <= 360px) {
  .todo-item {
    padding: 0.6rem;
  }

  .edit-input {
    font-size: 0.85rem;
    padding: 0.5rem 0.7rem;
  }

  .todo-priority {
    font-size: 0.65rem;
  }
}
</style>
