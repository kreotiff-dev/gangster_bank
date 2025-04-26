<template>
    <div class="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-100">
      <div class="w-full max-w-4xl">
        <h1 class="text-2xl font-bold mb-6 text-gray-800 text-center">Мои карты</h1>
  
        <div v-if="loading" class="text-center text-gray-500">Загрузка карт...</div>
        <div v-else-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>
        <div v-else-if="cards.length === 0" class="text-center text-gray-500">У вас пока нет карт.</div>
  
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="card in cards" :key="card.id" class="bg-white rounded-lg shadow p-4">
            <p class="text-gray-700 font-semibold">Номер карты:</p>
            <p class="text-lg font-bold mb-2">{{ formatCardNumber(card.cardNumber) }}</p>

            <p class="text-gray-700">Баланс:</p>
            <p class="text-xl font-bold mb-2">
                {{ formatBalance(card.cardBalance, card.currency) }}
            </p>

            <p class="text-gray-500 text-sm">Статус: {{ card.cardStatus }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  interface Card {
  id: string
  cardNumber: string
  cardBalance: number
  currency: string
  cardStatus: string
  cardType?: string
}
  
  const cards = ref<Card[]>([])
  const loading = ref(true)
  const errorMessage = ref('')
  
  onMounted(async () => {
    try {
      const response = await axios.get('/api/cards', { withCredentials: true })
      cards.value = response.data
    } catch (error) {
      errorMessage.value = 'Ошибка загрузки карт.'
    } finally {
      loading.value = false
    }
  })
  
  function formatCardNumber(number: string): string {
    return number.replace(/\d{4}(?=\d)/g, '$& ').replace(/.(?=.{4})/g, '*')
  }
  
  function formatBalance(balance: number, currency: string): string {
    return `${balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ${currency}`
  }
  </script>
  