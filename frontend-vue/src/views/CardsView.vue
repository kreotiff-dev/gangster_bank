<template>
  <AppLayout>
    <div class="space-y-6 p-4">
      <h1 class="text-2xl font-bold text-gray-800">Мои карты</h1>
      
      <!-- Кнопка "Добавить новую карту" -->
      <div class="flex justify-end">
        <button
          @click="onRequestNewCard"
          class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          + Заказать карту
        </button>
      </div>
      
      <!-- Список карт -->
      <div class="grid grid-cols-1 gap-4">
        <CardItem
          v-for="card in cards"
          :key="card.id"
          :card="card"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/Layout/AppLayout.vue'
import CardItem from '@/components/Cards/CardItem.vue'

import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Card {
  id: number
  cardholderFirstname: string
  cardholderLastname: string
  cardNumber: string
  expirationDate: string
  cardBalance: number
  currency: string
  cardStatus: string
  cardType: string
  number: string
  balance: number
  type: 'debit' | 'credit'  // Changed from string to union type
}

const cards = ref<Card[]>([])

const fetchCards = async () => {
  try {
    const response = await axios.get('/api/cards')
    cards.value = response.data.map((card: any) => ({
      ...card,
      type: validateCardType(card.type),
    }))
  } catch (error) {
    console.error('Ошибка загрузки карт:', error)
  }
}

const onRequestNewCard = () => {
  // Пока просто заглушка — потом сделаем модалку или переход на страницу заявки
  alert('Заявка на новую карту оформляется (будет отдельная страница)! 🚀')
}

const validateCardType = (type: string): 'debit' | 'credit' => {
  return type === 'debit' || type === 'credit' ? type : 'debit' // Default to 'debit' if invalid
}

onMounted(fetchCards)
</script>