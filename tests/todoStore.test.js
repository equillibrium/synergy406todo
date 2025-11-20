import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../src/stores/todoStore'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('добавляет задачу', () => {
    const store = useTodoStore()
    store.addTodo('Новая задача')
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0].text).toBe('Новая задача')
  })

  it('переключает статус выполненности', () => {
    const store = useTodoStore()
    store.addTodo('Тест')
    store.toggleTodo(0)
    expect(store.todos[0].completed).toBe(true)
  })

  it('удаляет задачу', () => {
    const store = useTodoStore()
    store.addTodo('Удалить меня')
    store.deleteTodo(0)
    expect(store.todos).toHaveLength(0)
  })
})
