import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => user.value?.username || '')

  // Actions
  async function register(username, email, password) {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/auth/register', {
        username,
        email,
        password,
      })

      // Сохраняем данные
      user.value = data.user
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      return data
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка регистрации'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      })

      // Сохраняем данные
      user.value = data.user
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      return data
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка входа'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Очищаем данные в любом случае
      user.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (err) {
      console.error('Fetch user error:', err)
      // Если не удалось получить пользователя - очищаем токены
      await logout()
    } finally {
      loading.value = false
    }
  }

  function initializeAuth() {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    if (storedUser && token) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Error parsing stored user:', err)
        logout()
      }
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,

    // Computed
    isAuthenticated,
    userEmail,
    userName,

    // Actions
    register,
    login,
    logout,
    fetchCurrentUser,
    initializeAuth,
    clearError,
  }
})
