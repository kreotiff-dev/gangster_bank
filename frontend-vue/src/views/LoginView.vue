<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Вход в аккаунт</h1>
  
        <form @submit.prevent="onLogin">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="phone">phone</label>
            <input
              v-model="phone"
              id="phone"
              type="phone"
              required
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div class="mb-6">
            <label class="block text-gray-700 mb-2" for="password">Пароль</label>
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            :disabled="loading"
          >
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
  
          <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
        </form>
  
        <div class="mt-6 text-center text-sm text-gray-600">
          Нет аккаунта?
          <router-link to="/register" class="text-blue-500 hover:underline">Зарегистрируйтесь</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  
  const phone = ref('')
  const password = ref('')
  const loading = ref(false)
  const errorMessage = ref('')
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const onLogin = async () => {
    loading.value = true
    errorMessage.value = ''
  
    try {
      await authStore.login(phone.value, password.value)
      router.push('/personal-cabinet')
    } catch (error) {
      errorMessage.value = 'Ошибка входа. Проверьте номер телефона и пароль.'
    } finally {
      loading.value = false
    }
  }
  </script>
  