<template>
  <AppLayout>
    <div class="card-details-container">
      <!-- Верхняя панель с кнопкой назад -->
      <div class="back-button-container">
        <button @click="router.back()" class="back-button">
          <span class="back-icon">←</span>
          <span>Назад</span>
        </button>
      </div>

      <h1 class="page-title">Детали карты</h1>

      <!-- Индикатор загрузки -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Загрузка данных...</p>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="fetchCardData" class="retry-button">
          Попробовать снова
        </button>
      </div>

      <template v-else>
        <!-- Карточка с деталями -->
        <div class="card-details-card" :class="{ 'premium': isCardCredit }">
          <div class="card-chip"></div>
          <div class="card-logo">{{ getCardSystem(card?.cardNumber) }}</div>
          
          <div class="card-type-label">{{ cardTypeLabel }}</div>
          
          <div class="card-number-container">
            <p class="card-holder">{{ card?.cardholderFirstname }} {{ card?.cardholderLastname }}</p>
            <p class="card-number">{{ formatCardNumber(card?.cardNumber) }}</p>
          </div>
          
          <div class="card-info-row">
            <div class="card-info-item">
              <p class="info-label">Баланс</p>
              <p class="info-value">{{ formatCurrency(card?.cardBalance, card?.currency) }}</p>
            </div>
            <div class="card-info-item">
              <p class="info-label">Срок действия</p>
              <p class="info-value">{{ formatExpirationDate(card?.expirationDate) }}</p>
            </div>
          </div>
          
          <div class="card-status-badge" :class="statusClass">
            {{ getStatusText(card?.cardStatus) }}
          </div>
        </div>

        <!-- Кнопки управления картой -->
        <div class="card-actions">
          <button @click="showActionSheet = true" class="primary-button">
            <span class="button-icon">⚙️</span>
            Управление картой
          </button>
          
          <button @click="toggleTransactions" class="secondary-button">
            <span class="button-icon">📊</span>
            {{ showTransactions ? 'Скрыть историю' : 'История операций' }}
          </button>
        </div>

        <!-- История транзакций -->
        <div v-if="showTransactions" class="transactions-section">
          <div v-if="transactionsLoading" class="loading-indicator">
            <div class="spinner small"></div>
            <span>Загрузка операций...</span>
          </div>
          
          <div v-else-if="transactions.length === 0" class="empty-state">
            Нет операций по данной карте
          </div>
          
          <div v-else class="transactions-list">
            <div v-for="transaction in formattedTransactions" :key="transaction.id" class="transaction-item">
              <div class="transaction-icon" :class="getTransactionIconClass(transaction.transactionType)">
                {{ getTransactionIcon(transaction.transactionType) }}
              </div>
              <div class="transaction-details">
                <div class="transaction-title">{{ getTransactionTitle(transaction.transactionType) }}</div>
                <div class="transaction-date">{{ formatTransactionDate(transaction.transactionDate) }}</div>
              </div>
              <div class="transaction-amount" :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
                {{ formatCurrency(transaction.amount, card?.currency) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Sheet для управления картой -->
        <div v-if="showActionSheet" class="action-sheet-backdrop" @click="showActionSheet = false">
          <div class="action-sheet" @click.stop>
            <div class="action-sheet-header">
              <h3>Управление картой</h3>
              <button @click="showActionSheet = false" class="close-button">×</button>
            </div>
            
            <div class="action-sheet-content">
              <button 
                @click="blockCard" 
                class="action-button danger"
                :disabled="card?.cardStatus === 'Blocked'"
              >
                <span class="action-icon">🔒</span>
                <span class="action-text">Заблокировать карту</span>
              </button>
              
              <button 
                @click="reissueCard" 
                class="action-button warning"
                :disabled="card?.cardStatus === 'Reissue requested'"
              >
                <span class="action-icon">🔄</span>
                <span class="action-text">Перевыпустить карту</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/Layout/AppLayout.vue'
import { cardsApi, transactionsApi } from '@/services/api'
import { Card, Transaction } from '@/types'

const route = useRoute()
const router = useRouter()

// Получаем ID карты из URL
const cardId = computed(() => route.params.id)

// Состояние компонента
const card = ref<Card | null>(null)
const transactions = ref<Transaction[]>([])
const loading = ref(true)
const transactionsLoading = ref(false)
const error = ref('')
const showTransactions = ref(false)
const showActionSheet = ref(false)

// Вычисляемые свойства
const isCardCredit = computed(() => {
  return card.value?.cardType?.toLowerCase() === 'credit'
})

const cardTypeLabel = computed(() => {
  return isCardCredit.value ? 'КРЕДИТНАЯ КАРТА' : 'ДЕБЕТОВАЯ КАРТА'
})

const statusClass = computed(() => {
  if (!card.value) return ''
  
  const status = card.value.cardStatus?.toLowerCase() || ''
  
  if (status.includes('active')) return 'status-active'
  if (status.includes('block')) return 'status-blocked'
  if (status.includes('reissue')) return 'status-pending'
  if (status.includes('expired')) return 'status-expired'
  
  return ''
})

const formattedTransactions = computed(() => {
  return transactions.value.map(transaction => ({
    ...transaction,
    formattedDate: formatTransactionDate(transaction.transactionDate),
    formattedAmount: formatCurrency(transaction.amount, card.value?.currency || '₽'),
    iconClass: getTransactionIconClass(transaction.transactionType),
    icon: getTransactionIcon(transaction.transactionType),
    title: getTransactionTitle(transaction.transactionType)
  }))
})

// Методы для загрузки данных
const fetchCardData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await cardsApi.getCard(cardId.value)
    card.value = response.data
    loading.value = false
  } catch (err: any) {
    console.error('Ошибка загрузки карты:', err)
    error.value = err.response?.data?.message || 'Не удалось загрузить данные карты'
    loading.value = false
  }
}

const fetchTransactions = async () => {
  transactionsLoading.value = true
  
  try {
    const response = await transactionsApi.getCardTransactions(cardId.value)
    transactions.value = response.data
    transactionsLoading.value = false
  } catch (err: any) {
    console.error('Ошибка загрузки транзакций:', err)
    transactions.value = [] // Устанавливаем пустой массив в случае ошибки
    transactionsLoading.value = false
  }
}

const toggleTransactions = () => {
  showTransactions.value = !showTransactions.value
  
  if (showTransactions.value && transactions.value.length === 0) {
    fetchTransactions()
  }
}

// Методы для управления картой
const blockCard = async () => {
  try {
    await cardsApi.blockCard(cardId.value)
    showActionSheet.value = false
    // Обновляем данные карты после блокировки
    await fetchCardData()
    alert('Карта успешно заблокирована')
  } catch (err: any) {
    console.error('Ошибка блокировки карты:', err)
    alert('Не удалось заблокировать карту: ' + (err.response?.data?.message || 'Произошла ошибка'))
  }
}

const reissueCard = async () => {
  try {
    await cardsApi.reissueCard(cardId.value)
    showActionSheet.value = false
    // Обновляем данные карты после запроса на перевыпуск
    await fetchCardData()
    alert('Заявка на перевыпуск карты принята')
  } catch (err: any) {
    console.error('Ошибка перевыпуска карты:', err)
    alert('Не удалось оформить перевыпуск карты: ' + (err.response?.data?.message || 'Произошла ошибка'))
  }
}

// Вспомогательные функции для форматирования данных
const formatCardNumber = (number: string | undefined): string => {
  if (!number) return '****'
  return number.slice(0, 4) + ' **** **** ' + number.slice(-4)
}

const formatExpirationDate = (date: string | undefined): string => {
  if (!date) return ''
  try {
    const dateObj = new Date(date)
    return `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getFullYear()).slice(-2)}`
  } catch {
    return date
  }
}

const formatCurrency = (amount: number | undefined, currency: string = '₽'): string => {
  if (amount === undefined) return '0 ' + currency
  return amount.toLocaleString('ru-RU') + ' ' + currency
}

const formatTransactionDate = (date: string | undefined): string => {
  if (!date) return ''
  try {
    const dateObj = new Date(date)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][dateObj.getMonth()]
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    
    return `${day} ${month} • ${hours}:${minutes}`
  } catch {
    return date
  }
}

const getCardSystem = (cardNumber: string | undefined): string => {
  if (!cardNumber) return ''
  const firstDigit = cardNumber.charAt(0)
  if (firstDigit === '4') return 'VISA'
  if (firstDigit === '5') return 'MC'
  return 'CARD'
}

const getStatusText = (status: string | undefined): string => {
  if (!status) return ''
  
  const statusMap: Record<string, string> = {
    'active': 'Активна',
    'blocked': 'Заблокирована',
    'Blocked': 'Заблокирована',
    'reissue requested': 'Перевыпуск',
    'Reissue requested': 'Перевыпуск',
    'expired': 'Истекла'
  }
  
  return statusMap[status.toLowerCase()] || status
}

const getTransactionIconClass = (type: string | undefined): string => {
  if (!type) return ''
  
  const lowerType = type.toLowerCase()
  if (lowerType.includes('transfer_in') || lowerType.includes('deposit')) return 'income'
  if (lowerType.includes('shopping') || lowerType.includes('payment')) return 'shopping'
  if (lowerType.includes('utility')) return 'utility'
  if (lowerType.includes('food')) return 'food'
  
  return 'expense'
}

const getTransactionIcon = (type: string | undefined): string => {
  if (!type) return '↔'
  
  const lowerType = type.toLowerCase()
  if (lowerType.includes('transfer_in')) return '↓'
  if (lowerType.includes('transfer_out')) return '↑'
  if (lowerType.includes('shopping') || lowerType.includes('payment')) return '🛒'
  if (lowerType.includes('utility')) return '🏠'
  if (lowerType.includes('food')) return '🍔'
  
  return '↔'
}

const getTransactionTitle = (type: string | undefined): string => {
  if (!type) return 'Операция'
  
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
  }
  
  return typeMap[type.toLowerCase()] || 'Операция'
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchCardData()
})
</script>

<style scoped>
.card-details-container {
  padding: 0 20px 40px 20px;
  color: rgba(255,255,255,0.9);
}

.back-button-container {
  margin: 16px 0;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.back-button:hover {
  color: white;
}

.back-icon {
  margin-right: 6px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: white;
}

/* Стили для карточки с деталями */
.card-details-card {
  background: linear-gradient(135deg, #4A6CF7, #1E3A8A);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  min-height: 200px;
  margin-bottom: 24px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card-details-card.premium {
  background: linear-gradient(135deg, #111827, #374151);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.card-chip {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 24px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 4px;
}

.card-logo {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 30px;
  background-color: rgba(255,255,255,0.15);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.card-type-label {
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.card-number-container {
  margin-bottom: 24px;
}

.card-holder {
  font-weight: 600;
  margin-bottom: 4px;
}

.card-number {
  font-size: 18px;
  letter-spacing: 2px;
}

.card-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-info-item {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 4px;
}

.info-value {
  font-weight: 600;
}

.card-status-badge {
  position: absolute;
  top: 24px;
  left: 24px;
  background-color: rgba(80, 200, 120, 0.2);
  color: #50C878;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: uppercase;
}

.card-status-badge.status-blocked {
  background-color: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.card-status-badge.status-expired {
  background-color: rgba(156, 163, 175, 0.2);
  color: #9CA3AF;
}

/* Стили для кнопок управления */
.card-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.primary-button {
  flex: 1;
  background: linear-gradient(135deg, #FF6B6B, #FFD166);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  transition: transform 0.2s;
}

.primary-button:hover {
  transform: translateY(-2px);
}

.secondary-button {
  flex: 1;
  background-color: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background-color: rgba(255,255,255,0.15);
}

.button-icon {
  margin-right: 8px;
}

/* Стили для секции транзакций */
.transactions-section {
  background-color: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.transaction-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 4px;
}

.transaction-filters::-webkit-scrollbar {
  display: none;
}

.filter-option {
  padding: 8px 16px;
  background-color: rgba(255,255,255,0.08);
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-option:hover {
  background-color: rgba(255,255,255,0.12);
}

.filter-option.active {
  background-color: rgba(255,255,255,0.15);
  font-weight: 500;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  color: rgba(255,255,255,0.6);
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: rgba(255,255,255,0.6);
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
  background-color: rgba(255,255,255,0.03);
  border-radius: 12px;
  transition: background-color 0.2s;
}

.transaction-item:hover {
  background-color: rgba(255,255,255,0.06);
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(255,255,255,0.08);
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

.transaction-icon.cafe {
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
  color: rgba(255,255,255,0.6);
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

/* Action Sheet стили */
.action-sheet-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.action-sheet {
  width: 100%;
  max-width: 500px;
  background-color: #1A1A1A;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.action-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.action-sheet-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255,255,255,0.1);
  color: white;
}

.action-sheet-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: rgba(255,255,255,0.08);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
}

.action-button:hover {
  background-color: rgba(255,255,255,0.12);
}

.action-button.danger {
  background-color: rgba(239, 68, 68, 0.1);
}

.action-button.danger:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.action-button.warning {
  background-color: rgba(249, 115, 22, 0.1);
}

.action-button.warning:hover {
  background-color: rgba(249, 115, 22, 0.2);
}

.action-icon {
  margin-right: 12px;
  font-size: 20px;
  width: 30px;
  text-align: center;
}
</style>