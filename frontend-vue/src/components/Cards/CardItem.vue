<template>
  <div class="card" :class="[cardType]">
    <div class="card-content">
      <div class="card-top">
        <div class="card-type">{{ getCardTypeLabel }}</div>
        <div class="card-chip"></div>
      </div>
      
      <div class="card-number">
        {{ formatCardNumber(card.number || card.cardNumber) }}
      </div>
      
      <div class="card-bottom">
        <div class="card-info">
          <div class="card-balance">{{ formatBalance(card.balance || card.cardBalance) }}</div>
          <div class="card-expiry">Срок действия: {{ formatExpiry(card.expirationDate) }}</div>
        </div>
        <div class="card-logo">
          <div class="payment-system">{{ getPaymentSystem }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Определение пропсов
interface Props {
  card: any;
  isActive?: boolean;
}

const props = defineProps<Props>();

// Вычисляемые свойства для отображения данных карты
const cardType = computed(() => {
  const type = props.card.type || props.card.cardType;
  return type?.toLowerCase() === 'credit' ? 'credit-card' : 'debit-card';
});

const getCardTypeLabel = computed(() => {
  const type = props.card.type || props.card.cardType;
  return type?.toLowerCase() === 'credit' ? 'КРЕДИТНАЯ КАРТА' : 'ДЕБЕТОВАЯ КАРТА';
});

const getPaymentSystem = computed(() => {
  // Определяем платежную систему по номеру карты
  const number = props.card.number || props.card.cardNumber || '';
  const firstDigit = number.toString().charAt(0);
  
  if (firstDigit === '4') return 'VISA';
  if (firstDigit === '5') return 'MASTERCARD';
  if (firstDigit === '2') return 'MIR';
  return 'VISA'; // По умолчанию
});

// Функции форматирования
const formatCardNumber = (number: string) => {
  if (!number) return '0000 0000 0000 0000';
  
  // Форматирование номера карты 4 x 4 цифры
  const digits = number.replace(/\D/g, '');
  const groups = [];
  
  for (let i = 0; i < 16; i += 4) {
    groups.push(digits.substring(i, i + 4));
  }
  
  return groups.join(' ');
};

const formatBalance = (balance: number) => {
  if (balance === undefined || balance === null) return '0 ₽';
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(balance) + ' ₽';
};

const formatExpiry = (date: string) => {
  if (!date) return 'ММ/ГГ';
  
  // Если дата уже в формате MM/YY
  if (date.includes('/')) return date;
  
  // Если дата в формате ISO (YYYY-MM-DD...)
  try {
    const dateObj = new Date(date);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${month}/${year}`;
  } catch (e) {
    return 'ММ/ГГ';
  }
};
</script>

<style scoped>
.card {
  width: 100%;
  aspect-ratio: 1.58 / 1;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.debit-card {
  background: linear-gradient(135deg, #4a4af6 0%, #7e73ee 100%);
  color: white;
}

.credit-card {
  background: linear-gradient(135deg, #5b44c2 0%, #8956ff 100%);
  color: white;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.card-type {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.card-chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(145deg, #e6b800, #ffd700);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.card-chip::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
}

.card-number {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-balance {
  font-size: 24px;
  font-weight: 700;
}

.card-expiry {
  font-size: 12px;
  opacity: 0.8;
}

.card-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.payment-system {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
}

/* Добавляем эффект градиентного блика на карте */
.card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  pointer-events: none;
}
</style>