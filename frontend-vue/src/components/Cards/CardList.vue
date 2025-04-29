<template>
  <div class="cards-section">
    <div class="section-header">
      <div class="section-title">Мои карты</div>
      <div class="see-all" @click="navigateToAllCards">Все карты</div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">Загрузка карт...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchCards" class="retry-button">
        Попробовать снова
      </button>
    </div>
    
    <div v-else class="cards-container">
      <CardItem 
        v-for="card in cards" 
        :key="card.id" 
        :card="processCardData(card)" 
        :isActive="card.id === activeCardId"
        @click="navigateToCardDetails(card.id)"
      />
      
      <div class="add-card-btn" @click="onRequestNewCard">
        <div class="add-icon">+</div>
        <div>Заказать новую карту</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardItem from './CardItem.vue'
import { cardsApi } from '@/services/api'
import { Card } from '@/types'

const router = useRouter()
const cards = ref<Card[]>([])
const loading = ref(true)
const error = ref('')
const activeCardId = ref<number | null>(null)

// Загрузка списка карт с сервера
const fetchCards = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await cardsApi.getCards()
    
    cards.value = response.data
    
    // Если есть карты, устанавливаем первую как активную
    if (cards.value.length > 0) {
      activeCardId.value = cards.value[0].id
    }
    
    loading.value = false
  } catch (err: any) {
    console.error('Ошибка загрузки карт:', err)
    error.value = err.response?.data?.message || 'Не удалось загрузить карты. Пожалуйста, попробуйте позже.'
    loading.value = false
  }
}

// Обработка данных карты для отображения
const processCardData = (card: any): Card => {
  // Определяем тип карты
  const cardType = (card.cardType || '').toLowerCase() === 'credit' ? 'credit' : 'debit'
  
  // Форматируем дату
  let expirationDate = card.expirationDate || ''
  if (expirationDate && typeof expirationDate === 'string' && expirationDate.includes('T')) {
    const date = new Date(expirationDate)
    expirationDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`
  }
  
  return {
    ...card,
    cardType,
    expirationDate
  }
}

// Переход на страницу с деталями карты
const navigateToCardDetails = (cardId: number) => {
  router.push(`/cards/${cardId}`)
}

// Переход на страницу со всеми картами
const navigateToAllCards = () => {
  router.push('/cards')
}

// Обработчик для запроса новой карты
const onRequestNewCard = () => {
  router.push('/cards/new')
}

// Загрузка данных при монтировании компонента
onMounted(fetchCards)
</script>

<style scoped>
.cards-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.see-all {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: color 0.2s;
}

.see-all:hover {
  color: rgba(255,255,255,0.8);
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.carousel-wrapper {
  width: 100%;
  overflow: hidden;
}

.carousel-slide {
  display: flex;
  gap: 16px;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex: 0 0 auto;
  min-width: 280px;
  transition: all 0.3s ease;
}

.carousel-item.active {
  transform: scale(1.02);
}

.carousel-nav {
  position: absolute;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.2s ease;
}

.carousel-nav:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-prev {
  left: -18px;
}

.carousel-next {
  right: -18px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background-color: rgba(255, 255, 255, 0.7);
  width: 24px;
  border-radius: 4px;
}

.add-card-btn {
  min-width: 280px;
  height: 170px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s;
}

.add-card-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.05);
}

.add-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>