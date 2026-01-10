<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Вход</h1>
        <p class="auth-subtitle">Войдите в свой аккаунт для управления задачами</p>

        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="form-input"
              placeholder="your@email.com"
              :disabled="authStore.loading"
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="form-input"
              placeholder="Введите пароль"
              :disabled="authStore.loading"
            />
          </div>

          <!-- Error message -->
          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
            <span v-if="!authStore.loading">Войти</span>
            <span v-else class="loading-spinner">Загрузка...</span>
          </button>
        </form>

        <!-- Link to register -->
        <div class="auth-footer">
          <p>
            Нет аккаунта?
            <router-link to="/register" class="auth-link">Зарегистрироваться</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

const formData = reactive({
  email: '',
  password: '',
})

const handleLogin = async () => {
  authStore.clearError()

  try {
    await authStore.login(formData.email, formData.password)

    // Загружаем задачи после успешного входа
    await todoStore.fetchTodos()

    // Перенаправляем на главную
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  text-align: center;
}

.auth-subtitle {
  font-size: 14px;
  color: #718096;
  margin: 0 0 32px 0;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background-color: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-block {
  width: 100%;
  margin-top: 8px;
}

.loading-spinner {
  display: inline-block;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #718096;
}

.auth-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
