<template>
  <div class="activity-section">
    <div class="section-header">
      <div class="section-title">Последние операции</div>
      <div class="see-all">История</div>
    </div>
    
    <div class="transactions">
      <div class="transaction-filters">
        <div class="filter-option" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">Все</div>
        <div class="filter-option" :class="{ active: activeFilter === 'expense' }" @click="setFilter('expense')">Расходы</div>
        <div class="filter-option" :class="{ active: activeFilter === 'income' }" @click="setFilter('income')">Доходы</div>
        <div class="filter-option" :class="{ active: activeFilter === 'transfers' }" @click="setFilter('transfers')">Переводы</div>
      </div>
      
      <TransactionItem 
        v-for="transaction in filteredTransactions" 
        :key="transaction.id" 
        :title="transaction.title"
        :amount="transaction.amount"
        :currency="transaction.currency"
        :type="transaction.type"
        :date="transaction.date"
        :category="transaction.category"
        :cardInfo="transaction.cardInfo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TransactionItem from './TransactionItem.vue'

interface Transaction {
  id: number
  title: string
  amount: number
  currency: string
  type: 'income' | 'expense'
  date: string
  category?: string
  cardInfo?: string
}

// Временные данные для демонстрации
const transactions = ref<Transaction[]>([
  {
    id: 1,
    title: 'Перевод от Анны',
    amount: 8500,
    currency: '₽',
    type: 'income',
    date: '25 апр • 14:32',
    category: 'transfer',
    cardInfo: 'Visa *5678'
  },
  {
    id: 2,
    title: 'Оплата ЖКХ',
    amount: 3200,
    currency: '₽',
    type: 'expense',
    date: '24 апр • 10:15',
    category: 'utility',
    cardInfo: 'MC *4321'
  },
  {
    id: 3,
    title: 'Перекресток',
    amount: 1500,
    currency: '₽',
    type: 'expense',
    date: '23 апр • 18:42',
    category: 'shopping',
    cardInfo: 'Visa *5678'
  },
  {
    id: 4,
    title: 'Кофейня "Зерно"',
    amount: 350,
    currency: '₽',
    type: 'expense',
    date: '23 апр • 09:21',
    category: 'cafe',
    cardInfo: 'MC *4321'
  },
  {
    id: 5,
    title: 'Перевод Максиму',
    amount: 2000,
    currency: '₽',
    type: 'expense',
    date: '22 апр • 16:55',
    category: 'transfer',
    cardInfo: 'Visa *5678'
  }
])

const activeFilter = ref('all')

const setFilter = (filter: string) => {
  activeFilter.value = filter
}

const filteredTransactions = computed(() => {
  if (activeFilter.value === 'all') {
    return transactions.value
  } else if (activeFilter.value === 'expense') {
    return transactions.value.filter(t => t.type === 'expense')
  } else if (activeFilter.value === 'income') {
    return transactions.value.filter(t => t.type === 'income')
  } else if (activeFilter.value === 'transfers') {
    return transactions.value.filter(t => t.category === 'transfer')
  }
  return transactions.value
})
</script>

<style scoped>
.activity-section {
  margin-bottom: 24px;
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

.transactions {
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 20px;
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
</style>