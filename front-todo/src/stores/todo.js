import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', () => {
  // Состояние
  const todos = ref([
    {
      id: 1,
      title: 'Изучить Vue 3',
      completed: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Настроить Pinia',
      completed: true,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
  ])

  const filter = ref('all') // all, active, completed
  const newTodoTitle = ref('')

  // Геттеры
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter((todo) => !todo.completed)
      case 'completed':
        return todos.value.filter((todo) => todo.completed)
      default:
        return todos.value
    }
  })

  const todosCount = computed(() => todos.value.length)
  const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length)
  const activeCount = computed(() => todos.value.filter((todo) => !todo.completed).length)

  // Действия
  function addTodo() {
    if (newTodoTitle.value.trim()) {
      const newTodo = {
        id: Date.now(),
        title: newTodoTitle.value.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
      }
      todos.value.unshift(newTodo)
      newTodoTitle.value = ''
    }
  }

  function toggleTodo(id) {
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  function deleteTodo(id) {
    const index = todos.value.findIndex((todo) => todo.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  function updateTodo(id, updates) {
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      Object.assign(todo, updates)
    }
  }

  function setFilter(newFilter) {
    filter.value = newFilter
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed)
  }

  return {
    // Состояние
    todos,
    filter,
    newTodoTitle,
    // Геттеры
    filteredTodos,
    todosCount,
    completedCount,
    activeCount,
    // Действия
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    clearCompleted,
  }
})
