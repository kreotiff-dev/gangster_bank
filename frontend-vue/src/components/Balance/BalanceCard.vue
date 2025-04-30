<template>
  <div class="main-card">
    <div class="balance-section">
      <div class="balance-label">Общий баланс</div>
      <div class="balance-amount">{{ formattedBalance }}</div>
      <div class="quick-actions">
        <div class="action-btn" @click="openTransferModal">
          <div class="action-icon">↑</div>
          <div class="action-label">Перевести</div>
        </div>
        <div class="action-btn">
          <div class="action-icon">↓</div>
          <div class="action-label">Пополнить</div>
        </div>
        <div class="action-btn">
          <div class="action-icon">📊</div>
          <div class="action-label">Анализ</div>
        </div>
        <div class="action-btn">
          <div class="action-icon">☰</div>
          <div class="action-label">Ещё</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCardsStore } from '@/stores/CardsStore'
import { storeToRefs } from 'pinia'

// Получаем хранилище карт
const cardsStore = useCardsStore()
const isLoading = ref(false)
const loadError = ref<string | null>(null)

// Используем storeToRefs для получения реактивного доступа к геттеру totalBalance
// Это обеспечит автоматическое обновление при изменении баланса карт
const { totalBalance } = storeToRefs(cardsStore)

// Форматируем баланс для отображения
const formattedBalance = computed(() => {
  return totalBalance.value.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  })
})

// Функция для перехода к странице переводов
const openTransferModal = () => {
  // В будущем здесь может быть логика для открытия модального окна перевода
  // или перенаправления на страницу переводов
}

// При загрузке компонента получаем карты с сервера, если они еще не загружены
onMounted(async () => {
  if (cardsStore.cards.length === 0) {
    isLoading.value = true
    try {
      await cardsStore.fetchCards()
    } catch (error) {
      console.error('Ошибка при загрузке карт:', error)
      loadError.value = 'Не удалось загрузить данные карт'
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<style scoped>
.main-card {
  background: linear-gradient(135deg, #1A1A1A, #2D2D2D);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.main-card::after {
  content: "";
  position: absolute;
  top: -20px;
  right: -20px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%);
  z-index: 0;
}

.balance-section {
  position: relative;
  z-index: 1;
}

.balance-label {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 24px;
  color: white;
}

.quick-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.action-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(255,255,255,0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.action-icon:hover {
  background-color: rgba(255,255,255,0.12);
}

.action-label {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}
</style>