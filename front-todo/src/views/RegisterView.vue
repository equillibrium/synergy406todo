<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Регистрация</h1>
        <p class="auth-subtitle">Создайте аккаунт для управления своими задачами</p>

        <form @submit.prevent="handleRegister" class="auth-form">
          <!-- Username -->
          <div class="form-group">
            <label for="username" class="form-label">Имя пользователя</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="form-input"
              placeholder="username"
              :disabled="authStore.loading"
            />
            <span class="form-hint"> Только буквы, цифры и подчеркивание, минимум 3 символа </span>
          </div>

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
              placeholder="Минимум 8 символов"
              :disabled="authStore.loading"
            />
            <span class="form-hint">
              Минимум 8 символов, включая заглавную букву, строчную и цифру
            </span>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              required
              class="form-input"
              placeholder="Повторите пароль"
              :disabled="authStore.loading"
            />
          </div>

          <!-- Error message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Submit button -->
          <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
            <span v-if="!authStore.loading">Зарегистрироваться</span>
            <span v-else class="loading-spinner">Загрузка...</span>
          </button>
        </form>

        <!-- Link to login -->
        <div class="auth-footer">
          <p>
            Уже есть аккаунт?
            <router-link to="/login" class="auth-link">Войти</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = computed(() => {
  if (authStore.error) {
    return authStore.error
  }

  if (
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword
  ) {
    return 'Пароли не совпадают'
  }

  return null
})

const handleRegister = async () => {
  authStore.clearError()

  // Проверка совпадения паролей
  if (formData.password !== formData.confirmPassword) {
    return
  }

  try {
    await authStore.register(formData.username, formData.email, formData.password)

    // Загружаем задачи после успешной регистрации
    await todoStore.fetchTodos()

    // Перенаправляем на главную
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
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

.form-hint {
  font-size: 12px;
  color: #a0aec0;
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
