<template>
  <div
    @click="$emit('click')"
    class="card"
    :class="{ 'premium': card.type === 'credit' }"
  >
    <div class="card-status">{{ statusText }}</div>
    <div class="card-chip"></div>
    <div>
      <div class="card-type">{{ typeText }}</div>
      <div class="card-number">{{ card.number }}</div>
    </div>
    <div>
      <div class="card-balance">{{ formattedBalance }}</div>
      <div class="card-limit">
        {{ card.type === 'credit' ? 'Кредитный лимит: 150 000 ₽' : 'Срок действия: 05/27' }}
      </div>
    </div>
    <div class="card-logo">{{ logoText }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const emit = defineEmits(['click']) 

interface Card {
  id: number
  number: string
  balance: number
  currency: string
  type: 'debit' | 'credit'
}

const props = defineProps<{
  card: Card
  isActive?: boolean
}>()

const statusText = computed(() => {
  return props.card.type === 'credit' ? 'Премиум' : 'Активна'
})

const typeText = computed(() => {
  return props.card.type === 'credit' ? 'Кредитная карта' : 'Дебетовая карта'
})

const logoText = computed(() => {
  // Для примера определим логотип по номеру карты
  // В реальном проекте здесь будет более сложная логика
  return props.card.number.startsWith('4') ? 'VISA' : 'MC'
})

const formattedBalance = computed(() => {
  return props.card.balance.toLocaleString('ru-RU') + ' ₽'
})
</script>

<style scoped>
.card {
  min-width: 280px;
  height: 170px;
  background: linear-gradient(135deg, #4A6CF7, #1E3A8A);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.card.premium {
  background: linear-gradient(135deg, #111827, #374151);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.card-chip {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 24px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 4px;
}

.card-logo {
  position: absolute;
  bottom: 20px;
  right: 20px;
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

.card-type {
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  letter-spacing: 1px;
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(0,0,0,0.2);
  padding: 4px 10px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
  z-index: 2;
}

.card-number {
  font-size: 18px;
  letter-spacing: 2px;
  margin-top: 60px; /* Увеличиваем отступ сверху */
  position: relative;
  z-index: 1;
}

.card-balance {
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
  position: relative;
  z-index: 1;
}

/* Добавляем фон с градиентом для улучшения читаемости текста */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.2) 100%);
  border-radius: 20px;
  z-index: 0;
}

.card-limit {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin-top: 4px;
}

.card-status {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(80, 200, 120, 0.2);
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 10px;
  color: #50C878;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium .card-status {
  background-color: rgba(255, 215, 0, 0.2);
  color: #FFD700;
}
</style>