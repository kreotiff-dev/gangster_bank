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
      <!-- Используем компонент карусели с кнопкой заказа карты внутри -->
      <CardCarousel 
        :cards="processedCards" 
        @card-click="navigateToCardDetails"
        @request-new-card="onRequestNewCard"
      />
    </div>
    
    <!-- Секция последних операций -->
    <div class="section-header">
      <div class="section-title">Последние операции</div>
      <div class="see-all" @click="navigateToAllTransactions">История</div>
    </div>
    
    <div v-if="transactionsLoading" class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">Загрузка операций...</p>
    </div>
    
    <div v-else-if="transactionsError" class="error-container">
      <p class="error-message">{{ transactionsError }}</p>
      <button @click="fetchTransactions" class="retry-button">
        Попробовать снова
      </button>
    </div>
    
    <div v-else-if="transactions.length === 0" class="empty-state">
      <p>Нет операций для отображения</p>
    </div>
    
    <div v-else class="transactions-container">
      <!-- Фильтры транзакций -->
      <div class="transaction-filters">
        <div 
          v-for="filter in transactionFilters" 
          :key="filter.id"
          @click="setTransactionFilter(filter.id)"
          class="filter-option"
          :class="{ active: currentFilter === filter.id }"
        >
          {{ filter.name }}
        </div>
      </div>
      
      <!-- Список транзакций -->
      <div class="transactions-list">
        <div 
          v-for="transaction in filteredTransactions" 
          :key="transaction.id" 
          class="transaction-item"
        >
          <div class="transaction-icon" :class="getTransactionIconClass(transaction.transactionType)">
            {{ getTransactionIcon(transaction.transactionType) }}
          </div>
          <div class="transaction-details">
            <div class="transaction-title">{{ getTransactionTitle(transaction.transactionType) }}</div>
            <div class="transaction-date">{{ formatTransactionDate(transaction.transactionDate) }}</div>
          </div>
          <div class="transaction-amount" :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
            {{ formatCurrency(transaction.amount) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CardCarousel from './CardCarousel.vue'
import { cardsApi, transactionsApi } from '@/services/api'
import type { Card, Transaction } from '@/types'
import { mapCardForCardItem } from '@/utils/mappers'

const router = useRouter()

// Состояние для карт
const cards = ref<Card[]>([])
const loading = ref(true)
const error = ref('')
const activeCardId = ref<number | null>(null)

// Состояние для транзакций
const transactions = ref<Transaction[]>([])
const transactionsLoading = ref(false)
const transactionsError = ref('')
const currentFilter = ref('all')

// Фильтры транзакций
const transactionFilters = [
  { id: 'all', name: 'Все' },
  { id: 'expense', name: 'Расходы' },
  { id: 'income', name: 'Доходы' },
  { id: 'transfers', name: 'Переводы' },
]

// Используем computed для обработки карт с помощью маппера
const processedCards = computed(() => {
  return cards.value.map(card => mapCardForCardItem(card))
})

// Фильтрация транзакций
const filteredTransactions = computed(() => {
  if (currentFilter.value === 'all') {
    return transactions.value.slice(0, 5) // Показываем только 5 последних транзакций
  }
  
  let filtered = transactions.value
  
  if (currentFilter.value === 'expense') {
    filtered = filtered.filter(t => t.amount < 0)
  } else if (currentFilter.value === 'income') {
    filtered = filtered.filter(t => t.amount > 0)
  } else if (currentFilter.value === 'transfers') {
    filtered = filtered.filter(t => 
      t.transactionType === 'transfer_in' || t.transactionType === 'transfer_out'
    )
  }
  
  return filtered.slice(0, 5) // Показываем только 5 последних транзакций
})

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

// Загрузка последних транзакций
const fetchTransactions = async () => {
  transactionsLoading.value = true
  transactionsError.value = ''
  
  try {
    const response = await transactionsApi.getTransactions()
    transactions.value = response.data
    transactionsLoading.value = false
  } catch (err: any) {
    console.error('Ошибка загрузки транзакций:', err)
    transactionsError.value = err.response?.data?.message || 'Не удалось загрузить операции. Пожалуйста, попробуйте позже.'
    transactionsLoading.value = false
  }
}

// Установка фильтра транзакций
const setTransactionFilter = (filterId: string) => {
  currentFilter.value = filterId
}

// Переход на страницу с деталями карты
const navigateToCardDetails = (cardId: number) => {
  router.push(`/cards/${cardId}`)
}

// Переход на страницу со всеми картами
const navigateToAllCards = () => {
  router.push('/cards')
}

// Переход на страницу с историей транзакций
const navigateToAllTransactions = () => {
  router.push('/transactions')
}

// Обработчик для запроса новой карты
const onRequestNewCard = () => {
  router.push('/cards/new')
}

// Вспомогательные функции для форматирования и отображения транзакций
const formatTransactionDate = (date: string): string => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][dateObj.getMonth()];
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} • ${hours}:${minutes}`;
  } catch (e) {
    return date;
  }
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ru-RU') + ' ₽';
}

const getTransactionIconClass = (type: string): string => {
  if (!type) return '';
  
  const lowerType = type.toLowerCase();
  if (lowerType.includes('transfer_in') || lowerType.includes('deposit')) return 'income';
  if (lowerType.includes('shopping') || lowerType.includes('payment')) return 'shopping';
  if (lowerType.includes('utility')) return 'utility';
  if (lowerType.includes('food')) return 'food';
  
  return 'expense';
}

const getTransactionIcon = (type: string): string => {
  if (!type) return '↔';
  
  const lowerType = type.toLowerCase();
  if (lowerType.includes('transfer_in')) return '↓';
  if (lowerType.includes('transfer_out')) return '↑';
  if (lowerType.includes('shopping') || lowerType.includes('payment')) return '🛒';
  if (lowerType.includes('utility')) return '🏠';
  if (lowerType.includes('food')) return '🍔';
  
  return '↔';
}

const getTransactionTitle = (type: string): string => {
  if (!type) return 'Операция';
  
  const typeMap: Record<string, string> = {
    'payment': 'Оплата',
    'withdrawal': 'Снятие наличных',
    'transfer_out': 'Перевод',
    'transfer_in': 'Поступление',
    'utility_payment': 'Оплата ЖКХ',
    'mobile_payment': 'Оплата связи',
    'food_payment': 'Продукты',
    'transport_payment': 'Транспорт',
    'entertainment_payment': 'Развлечения'
  };
  
  return typeMap[type.toLowerCase()] || 'Операция';
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchCards();
  fetchTransactions();
});
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

/* Стили для секции транзакций */
.transactions-container {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 32px;
}

.transaction-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none; /* для Firefox */
}

.transaction-filters::-webkit-scrollbar {
  display: none; /* для Chrome, Safari */
}

.filter-option {
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-option:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.filter-option.active {
  background-color: rgba(255, 255, 255, 0.15);
  font-weight: 500;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  transition: background-color 0.2s;
}

.transaction-item:hover {
  background-color: rgba(255, 255, 255, 0.06);
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 16px;
}

.transaction-icon.income {
  background-color: rgba(80, 200, 120, 0.15);
  color: #50C878;
}

.transaction-icon.expense {
  background-color: rgba(255, 107, 107, 0.15);
  color: #FF6B6B;
}

.transaction-icon.shopping {
  background-color: rgba(71, 85, 105, 0.15);
  color: #94A3B8;
}

.transaction-icon.utility {
  background-color: rgba(249, 115, 22, 0.15);
  color: #F97316;
}

.transaction-icon.food {
  background-color: rgba(249, 115, 22, 0.15);
  color: #F97316;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.transaction-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.transaction-amount {
  font-weight: 600;
}

.transaction-amount.positive {
  color: #50C878;
}

.transaction-amount.negative {
  color: #FF6B6B;
}

.loading-container, .error-container, .empty-state {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 12px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>