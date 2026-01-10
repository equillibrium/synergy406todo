import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref([])
  const filter = ref('all')
  const loading = ref(false)
  const error = ref(null)

  // Computed
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

  // Actions
  async function fetchTodos() {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get('/todos')
      todos.value = data.todos || []
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка загрузки задач'
      console.error('Fetch todos error:', err)
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title, priority = 'medium') {
    if (!title || !title.trim()) {
      error.value = 'Название задачи не может быть пустым'
      return
    }

    error.value = null

    try {
      const { data } = await api.post('/todos', {
        title: title.trim(),
        priority,
      })

      todos.value.unshift(data.todo)
      return data.todo
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка создания задачи'
      throw err
    }
  }

  async function toggleTodo(id) {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return

    const previousState = todo.completed

    // Оптимистичное обновление
    todo.completed = !todo.completed

    try {
      const { data } = await api.put(`/todos/${id}`, {
        completed: todo.completed,
      })

      // Обновляем данные с сервера
      Object.assign(todo, data.todo)
    } catch (err) {
      // Откатываем изменения при ошибке
      todo.completed = previousState
      error.value = err.response?.data?.error || 'Ошибка обновления задачи'
      throw err
    }
  }

  async function deleteTodo(id) {
    const index = todos.value.findIndex((t) => t.id === id)
    if (index === -1) return

    const deletedTodo = todos.value[index]

    // Оптимистичное удаление
    todos.value.splice(index, 1)

    try {
      await api.delete(`/todos/${id}`)
    } catch (err) {
      // Восстанавливаем задачу при ошибке
      todos.value.splice(index, 0, deletedTodo)
      error.value = err.response?.data?.error || 'Ошибка удаления задачи'
      throw err
    }
  }

  async function updateTodo(id, updates) {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return

    const previousState = { ...todo }

    // Оптимистичное обновление
    Object.assign(todo, updates)

    try {
      const { data } = await api.put(`/todos/${id}`, updates)
      Object.assign(todo, data.todo)
    } catch (err) {
      // Откатываем изменения при ошибке
      Object.assign(todo, previousState)
      error.value = err.response?.data?.error || 'Ошибка обновления задачи'
      throw err
    }
  }

  async function clearCompleted() {
    const completedTodos = todos.value.filter((t) => t.completed)

    // Оптимистичное удаление
    todos.value = todos.value.filter((t) => !t.completed)

    try {
      await api.delete('/todos/completed')
    } catch (err) {
      // Восстанавливаем задачи при ошибке
      todos.value = [...todos.value, ...completedTodos]
      error.value = err.response?.data?.error || 'Ошибка удаления задач'
      throw err
    }
  }

  function setFilter(newFilter) {
    filter.value = newFilter
  }

  function clearError() {
    error.value = null
  }

  // Очистка при выходе из системы
  function clearTodos() {
    todos.value = []
    filter.value = 'all'
    error.value = null
  }

  return {
    // State
    todos,
    filter,
    loading,
    error,

    // Computed
    filteredTodos,
    todosCount,
    completedCount,
    activeCount,

    // Actions
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    clearCompleted,
    clearError,
    clearTodos,
  }
})
