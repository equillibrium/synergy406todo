import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', () => {
  // Функция для загрузки из localStorage
  function loadTodosFromStorage() {
    try {
      const stored = localStorage.getItem('todo-app-todos')
      return stored ? JSON.parse(stored) : [
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
      ]
    } catch (error) {
      console.error('Ошибка загрузки данных из localStorage:', error)
      return []
    }
  }

  // Функция для сохранения в localStorage
  function saveTodosToStorage(todos) {
    try {
      localStorage.setItem('todo-app-todos', JSON.stringify(todos))
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error)
    }
  }

  // Состояние
  const todos = ref(loadTodosFromStorage())
  const filter = ref('all')
  const newTodoTitle = ref('')
  const newTodoPriority = ref('medium')

  // Автоматическое сохранение при изменении todos
  watch(
    todos,
    (newTodos) => {
      saveTodosToStorage(newTodos)
    },
    { deep: true }
  )

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
        priority: newTodoPriority.value,
        createdAt: new Date().toISOString(),
      }
      todos.value.unshift(newTodo)
      newTodoTitle.value = ''
      newTodoPriority.value = 'medium'
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

  // Функция для очистки всех данных
  function clearAllData() {
    todos.value = []
    localStorage.removeItem('todo-app-todos')
  }

  // Функция для экспорта данных
  function exportData() {
    const data = {
      todos: todos.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Функция для импорта данных
  function importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.todos && Array.isArray(data.todos)) {
            todos.value = data.todos
            resolve('Данные успешно импортированы')
          } else {
            reject('Неверный формат файла')
          }
        } catch (error) {
          console.error('Ошибка при чтении файла:', error)
          reject(error.message || 'Ошибка при чтении файла')
        }
      }
      reader.readAsText(file)
    })
  }

  return {
    // Состояние
    todos,
    filter,
    newTodoTitle,
    newTodoPriority,
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
    clearAllData,
    exportData,
    importData,
  }
})