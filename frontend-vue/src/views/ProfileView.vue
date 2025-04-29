<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div v-if="user" class="space-y-4">
          <img
            :src="user.avatar || defaultAvatar"
            alt="Аватар"
            class="w-24 h-24 rounded-full mx-auto"
          />
          <h2 class="text-2xl font-bold text-gray-800">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
  
          <button
            @click="onLogout"
            class="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Выйти
          </button>
        </div>
        <div v-else>
          <p class="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '@/stores/authStore'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const user = authStore.user
  const defaultAvatar = 'https://placehold.co/96x96'
  
  const onLogout = () => {
    authStore.logout()
    router.push('/login')
  }
  </script>
  