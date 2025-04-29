<template>
  <div class="main-card">
    <div class="balance-section">
      <div class="balance-label">Общий баланс</div>
      <div class="balance-amount">{{ formattedBalance }}</div>
      <div class="quick-actions">
        <div class="action-btn">
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
import { computed } from 'vue'

// В реальной логике здесь будет приходить баланс пользователя
// Пока что для примера сделаем фиксированный баланс
const balance = 148764.32

const formattedBalance = computed(() => {
  return balance.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  })
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