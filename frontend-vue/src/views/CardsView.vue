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
          v-for="card in processedCards"
          :key="card.id"
          :card="card"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/Layout/AppLayout.vue'
import CardItem from '@/components/Cards/CardItem.vue'
import axios from 'axios'
import { mapCardForCardItem } from '@/utils/mappers'
import type { Card } from '@/types'

const router = useRouter()
const cards = ref<Card[]>([])

// Используем computed для преобразования карт с помощью маппера
const processedCards = computed(() => {
  return cards.value.map(card => mapCardForCardItem(card))
})

const fetchCards = async () => {
  try {
    const response = await axios.get('/api/cards')
    cards.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки карт:', error)
  }
}

const onRequestNewCard = () => {
  router.push('/cards/new')
}

onMounted(fetchCards)
</script>