<template>
  <div class="transaction-item">
    <div class="transaction-info">
      <div class="transaction-icon" :class="iconClass">
        <span>{{ iconContent }}</span>
      </div>
      <div class="transaction-details">
        <div class="transaction-name">{{ title }}</div>
        <div class="transaction-meta">
          <div>{{ date }}</div>
          <div>•</div>
          <div>{{ cardInfo }}</div>
        </div>
      </div>
    </div>
    <div class="transaction-amount">
      <div class="amount" :class="amountClass">
        {{ formattedAmount }}
      </div>
      <div class="transaction-card">{{ cardInfo }}</div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue'
  
interface Props {
  title: string
  amount: number
  currency: string
  type: 'income' | 'expense'
  date: string
  category?: string
  cardInfo?: string
}
  
const props = defineProps<Props>()
  
const amountClass = computed(() => {
  return props.type === 'income' ? 'positive' : 'negative'
})
  
const formattedAmount = computed(() => {
  const sign = props.type === 'income' ? '+' : '-'
  return `${sign}${Math.abs(props.amount).toLocaleString()} ${props.currency}`
})

const cardInfo = computed(() => {
  return props.cardInfo || 'Основная карта'
})

const iconClass = computed(() => {
  if (props.type === 'income') {
    return 'transaction-icon-income'
  } else if (props.category === 'shopping') {
    return 'transaction-icon-shopping'
  } else {
    return 'transaction-icon-expense'
  }
})

const iconContent = computed(() => {
  if (props.type === 'income') {
    return '↓'
  } else if (props.category === 'shopping') {
    return '🛒'
  } else {
    return '↑'
  }
})
</script>
  
<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  gap: 16px;
}

.transaction-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.transaction-icon-income {
  background-color: rgba(80, 200, 120, 0.15);
  color: #50C878;
}

.transaction-icon-expense {
  background-color: rgba(255, 107, 107, 0.15);
  color: #FF6B6B;
}

.transaction-icon-shopping {
  background-color: rgba(71, 85, 105, 0.15);
  color: #94A3B8;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.transaction-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.transaction-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.transaction-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.amount {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.positive {
  color: #50C878;
}

.negative {
  color: #FF6B6B;
}

.transaction-card {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}
</style>