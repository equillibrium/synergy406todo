<template>
  <div class="todos-list">
    <TodoItem v-for="todo in todoStore.filteredTodos" :key="todo.id" :todo="todo" />
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todo'
import TodoItem from './TodoItem.vue'
const todoStore = useTodoStore()
</script>

<style scoped>
.todos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
