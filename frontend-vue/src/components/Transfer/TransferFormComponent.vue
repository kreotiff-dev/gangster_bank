<template>
    <div class="transfer-form-container">
      <div class="form-header">
        <h2 class="form-title">Перевод средств</h2>
        <button @click="$emit('close')" class="close-button">×</button>
      </div>
      
      <div class="form-content">
        <!-- Шаг 1: Выбор карты -->
        <div v-if="currentStep === 1" class="form-step">
          <h3 class="step-title">Шаг 1: Выберите карту отправителя</h3>
          
          <div class="cards-list">
            <div 
              v-for="card in userCards" 
              :key="card.id"
              class="card-option"
              :class="{ 'selected': selectedFromCard === card.id }"
              @click="selectFromCard(card)"
            >
              <div class="card-option-indicator" :class="{ 'active': selectedFromCard === card.id }"></div>
              <div class="card-option-type">{{ card.type === 'debit' ? 'Дебетовая' : 'Кредитная' }}</div>
              <div class="card-option-number">{{ formatCardNumber(card.number) }}</div>
              <div class="card-option-balance">{{ formatCurrency(card.balance) }}</div>
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="$emit('close')" class="cancel-button">Отмена</button>
            <button 
              @click="goToNextStep" 
              class="next-button"
              :disabled="!selectedFromCard"
            >
              Далее
            </button>
          </div>
        </div>
        
        <!-- Шаг 2: Выбор получателя -->
        <div v-if="currentStep === 2" class="form-step">
          <h3 class="step-title">Шаг 2: Выберите получателя</h3>
          
          <div class="recipient-tabs">
            <div 
              class="recipient-tab" 
              :class="{ 'active': recipientType === 'myCard' }"
              @click="recipientType = 'myCard'"
            >
              Моя карта
            </div>
            <div 
              class="recipient-tab" 
              :class="{ 'active': recipientType === 'cardNumber' }"
              @click="recipientType = 'cardNumber'"
            >
              По номеру карты
            </div>
            <div 
              class="recipient-tab" 
              :class="{ 'active': recipientType === 'phone' }"
              @click="recipientType = 'phone'"
            >
              По телефону
            </div>
          </div>
          
          <!-- Выбор своей карты -->
          <div v-if="recipientType === 'myCard'" class="recipient-section">
            <div class="cards-list">
              <div 
                v-for="card in otherCards" 
                :key="card.id"
                class="card-option"
                :class="{ 'selected': selectedToCard === card.id }"
                @click="selectToCard(card)"
              >
                <div class="card-option-indicator" :class="{ 'active': selectedToCard === card.id }"></div>
                <div class="card-option-type">{{ card.type === 'debit' ? 'Дебетовая' : 'Кредитная' }}</div>
                <div class="card-option-number">{{ formatCardNumber(card.number) }}</div>
                <div class="card-option-balance">{{ formatCurrency(card.balance) }}</div>
              </div>
            </div>
          </div>
          
          <!-- Ввод номера карты -->
          <div v-if="recipientType === 'cardNumber'" class="recipient-section">
            <div class="form-group">
              <label for="cardNumber" class="form-label">Номер карты получателя</label>
              <input 
                type="text" 
                id="cardNumber" 
                v-model="recipientCardNumber"
                class="form-input"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                @input="formatCardNumberInput"
              >
            </div>
          </div>
          
          <!-- Ввод телефона -->
          <div v-if="recipientType === 'phone'" class="recipient-section">
            <div class="form-group">
              <label for="phoneNumber" class="form-label">Номер телефона получателя</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                v-model="recipientPhone"
                class="form-input"
                placeholder="+7 (___) ___-__-__"
                maxlength="18"
                @input="formatPhoneInput"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="goBackStep" class="back-button">Назад</button>
            <button 
              @click="goToNextStep" 
              class="next-button"
              :disabled="!isRecipientValid"
            >
              Далее
            </button>
          </div>
        </div>
        
        <!-- Шаг 3: Сумма и детали -->
        <div v-if="currentStep === 3" class="form-step">
          <h3 class="step-title">Шаг 3: Укажите сумму перевода</h3>
          
          <div class="transfer-details">
            <div class="transfer-from">
              <div class="detail-label">Откуда</div>
              <div class="detail-value">{{ getCardInfo(selectedFromCard) }}</div>
            </div>
            
            <div class="transfer-arrow">→</div>
            
            <div class="transfer-to">
              <div class="detail-label">Куда</div>
              <div class="detail-value">
                {{ 
                  recipientType === 'myCard' ? getCardInfo(selectedToCard) : 
                  recipientType === 'cardNumber' ? recipientCardNumber : 
                  recipientPhone 
                }}
              </div>
            </div>
          </div>
          
          <div class="form-group amount-group">
            <label for="amount" class="form-label">Сумма перевода</label>
            <div class="amount-input-wrapper">
              <input 
                type="text" 
                id="amount" 
                v-model="amount"
                class="form-input amount-input"
                placeholder="0"
                @input="formatAmountInput"
              >
              <span class="currency-symbol">₽</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="comment" class="form-label">Комментарий (необязательно)</label>
            <input 
              type="text" 
              id="comment" 
              v-model="comment"
              class="form-input"
              placeholder="Например, за обед"
            >
          </div>
          
          <div class="commission-info">
            Комиссия: <span>0 ₽</span>
          </div>
          
          <div class="form-actions">
            <button @click="goBackStep" class="back-button">Назад</button>
            <button 
              @click="goToNextStep" 
              class="next-button"
              :disabled="!isAmountValid"
            >
              Далее
            </button>
          </div>
        </div>
        
        <!-- Шаг 4: Подтверждение -->
        <div v-if="currentStep === 4" class="form-step">
          <h3 class="step-title">Шаг 4: Подтверждение</h3>
          
          <div class="confirmation-box">
            <div class="confirmation-row">
              <div class="confirmation-label">Отправитель:</div>
              <div class="confirmation-value">{{ getCardInfo(selectedFromCard) }}</div>
            </div>
            
            <div class="confirmation-row">
              <div class="confirmation-label">Получатель:</div>
              <div class="confirmation-value">
                {{ 
                  recipientType === 'myCard' ? getCardInfo(selectedToCard) : 
                  recipientType === 'cardNumber' ? recipientCardNumber : 
                  recipientPhone 
                }}
              </div>
            </div>
            
            <div class="confirmation-row">
              <div class="confirmation-label">Сумма:</div>
              <div class="confirmation-value highlight">{{ formatCurrency(parseFloat(amount.replace(/\s/g, ''))) }}</div>
            </div>
            
            <div v-if="comment" class="confirmation-row">
              <div class="confirmation-label">Комментарий:</div>
              <div class="confirmation-value">{{ comment }}</div>
            </div>
            
            <div class="confirmation-row">
              <div class="confirmation-label">Комиссия:</div>
              <div class="confirmation-value">0 ₽</div>
            </div>
          </div>
          
          <div v-if="!smsCode" class="sms-request">
            <p>Для подтверждения перевода необходимо ввести код из СМС.</p>
            <button @click="requestSmsCode" class="sms-button">Получить код</button>
          </div>
          
          <div v-else class="sms-verification">
            <div class="form-group">
              <label for="smsCode" class="form-label">Введите код из СМС</label>
              <input 
                type="text" 
                id="smsCode" 
                v-model="smsVerificationCode"
                class="form-input"
                placeholder="0000"
                maxlength="4"
              >
            </div>
            <div class="resend-timer" v-if="resendCountdown > 0">
              Запросить код повторно через {{ resendCountdown }} сек
            </div>
            <div v-else class="resend-link" @click="requestSmsCode">
              Отправить код повторно
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="goBackStep" class="back-button">Назад</button>
            <button 
              @click="submitTransfer" 
              class="submit-button"
              :disabled="!isSubmitEnabled"
            >
              Перевести
            </button>
          </div>
        </div>
        
        <!-- Шаг 5: Результат -->
        <div v-if="currentStep === 5" class="form-step result-step">
          <div v-if="transferSuccess" class="success-result">
            <div class="success-icon">✓</div>
            <h3 class="result-title">Перевод выполнен успешно!</h3>
            <p class="result-detail">Средства зачислены на счет получателя.</p>
            
            <div class="result-details">
              <div class="result-row">
                <span class="result-label">Сумма:</span>
                <span class="result-value">{{ formatCurrency(parseFloat(amount.replace(/\s/g, ''))) }}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Получатель:</span>
                <span class="result-value">
                  {{ 
                    recipientType === 'myCard' ? getCardInfo(selectedToCard) : 
                    recipientType === 'cardNumber' ? recipientCardNumber : 
                    recipientPhone 
                  }}
                </span>
              </div>
              <div class="result-row">
                <span class="result-label">Дата операции:</span>
                <span class="result-value">{{ getCurrentDate() }}</span>
              </div>
              <div class="result-row">
                <span class="result-label">ID операции:</span>
                <span class="result-value">{{ generateTransactionId() }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="error-result">
            <div class="error-icon">✕</div>
            <h3 class="result-title">Ошибка при выполнении перевода</h3>
            <p class="result-detail">{{ errorMessage }}</p>
          </div>
          
          <div class="form-actions result-actions">
            <button @click="$emit('close')" class="close-result-button">Закрыть</button>
            <button v-if="transferSuccess" @click="openReceipt" class="receipt-button">
              Квитанция
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  
  // Определение пропсов
  interface Props {
    initialCardId?: number | string
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['close', 'success'])
  
  // Состояние формы
  const currentStep = ref(1)
  const selectedFromCard = ref<number | null>(null)
  const selectedToCard = ref<number | null>(null)
  const recipientType = ref('myCard')
  const recipientCardNumber = ref('')
  const recipientPhone = ref('')
  const amount = ref('')
  const comment = ref('')
  const smsCode = ref('')
  const smsVerificationCode = ref('')
  const resendCountdown = ref(0)
  const transferSuccess = ref(true)
  const errorMessage = ref('')
  
  // Моковые данные для карт
  const userCards = ref([
    {
      id: 1,
      number: '4276123456785678',
      balance: 42312.56,
      currency: '₽',
      type: 'debit'
    },
    {
      id: 2,
      number: '5489123456784321',
      balance: 106451.76,
      currency: '₽', 
      type: 'credit'
    }
  ])
  
  // Вычисляемое свойство для карт-получателей
  // (исключает выбранную карту отправителя)
  const otherCards = computed(() => {
    return userCards.value.filter(card => card.id !== selectedFromCard.value)
  })
  
  // Инициализация формы
  onMounted(() => {
    // Если передан initialCardId, выбираем эту карту как карту отправителя
    if (props.initialCardId) {
      const cardId = typeof props.initialCardId === 'string' 
        ? parseInt(props.initialCardId) 
        : props.initialCardId
      
      const card = userCards.value.find(c => c.id === cardId)
      if (card) {
        selectedFromCard.value = card.id
      }
    }
  })
  
  // Функции для навигации между шагами
  const goToNextStep = () => {
    if (currentStep.value < 5) {
      currentStep.value++
    }
  }
  
  const goBackStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  // Функции для выбора карт
  const selectFromCard = (card: any) => {
    selectedFromCard.value = card.id
    
    // Если выбрана та же карта, что и для получения, сбрасываем выбор получателя
    if (selectedToCard.value === card.id) {
      selectedToCard.value = null
    }
  }
  
  const selectToCard = (card: any) => {
    selectedToCard.value = card.id
  }
  
  // Функции форматирования ввода
  const formatCardNumberInput = () => {
    // Удаляем все нецифровые символы
    let value = recipientCardNumber.value.replace(/\D/g, '')
    
    // Форматируем в группы по 4 цифры с пробелами
    if (value.length > 0) {
      let formattedValue = ''
      for (let i = 0; i < value.length; i += 4) {
        formattedValue += value.substring(i, i + 4) + ' '
      }
      recipientCardNumber.value = formattedValue.trim()
    }
  }
  
  const formatPhoneInput = () => {
    // Удаляем все нецифровые символы
    let value = recipientPhone.value.replace(/\D/g, '')
    
    // Форматируем номер телефона в формате +7 (XXX) XXX-XX-XX
    if (value.length > 0) {
      if (value[0] !== '7') {
        value = '7' + value
      }
      
      let formattedValue = '+'
      
      if (value.length > 0) {
        formattedValue += value.substring(0, 1)
      }
      
      if (value.length > 1) {
        formattedValue += ' (' + value.substring(1, 4)
      }
      
      if (value.length > 4) {
        formattedValue += ') ' + value.substring(4, 7)
      }
      
      if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 9)
      }
      
      if (value.length > 9) {
        formattedValue += '-' + value.substring(9, 11)
      }
      
      recipientPhone.value = formattedValue
    }
  }
  
  const formatAmountInput = () => {
    // Удаляем все нецифровые символы, кроме точки и запятой
    let value = amount.value.replace(/[^\d.,]/g, '')
    
    // Заменяем запятую на точку
    value = value.replace(',', '.')
    
    // Проверяем, что после точки не более 2 знаков
    const parts = value.split('.')
    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 2)
      value = parts.join('.')
    }
    
    // Форматируем число с разделителями групп
    const numericValue = parseFloat(value) || 0
    amount.value = numericValue.toLocaleString('ru-RU', {
      maximumFractionDigits: 2,
      minimumFractionDigits: parts.length > 1 ? 2 : 0
    }).replace(',', '.')
  }
  
  // Вспомогательные функции
  const formatCardNumber = (number: string) => {
    if (!number) return ''
    return number.substring(0, 4) + ' **** **** ' + number.substring(12)
  }
  
  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return '0 ₽'
    return value.toLocaleString('ru-RU') + ' ₽'
  }
  
  const getCardInfo = (cardId: number | null) => {
    if (!cardId) return ''
    const card = userCards.value.find(c => c.id === cardId)
    if (!card) return ''
    return `${formatCardNumber(card.number)} (${formatCurrency(card.balance)})`
  }
  
  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const generateTransactionId = () => {
    return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')
  }
  
  // Проверка валидности данных
  const isRecipientValid = computed(() => {
    if (recipientType.value === 'myCard') {
      return selectedToCard.value !== null
    } else if (recipientType.value === 'cardNumber') {
      return recipientCardNumber.value.replace(/\s/g, '').length === 16
    } else if (recipientType.value === 'phone') {
      return recipientPhone.value.replace(/\D/g, '').length === 11
    }
    return false
  })
  
  const isAmountValid = computed(() => {
    if (!amount.value) return false
    
    const numericAmount = parseFloat(amount.value.replace(/\s/g, ''))
    if (isNaN(numericAmount) || numericAmount <= 0) return false
    
    // Проверяем, достаточно ли средств на карте
    if (selectedFromCard.value) {
      const card = userCards.value.find(c => c.id === selectedFromCard.value)
      if (card && numericAmount > card.balance) return false
    }
    
    return true
  })
  
  const isSubmitEnabled = computed(() => {
    return smsCode.value && smsVerificationCode.value.length === 4
  })
  
  // Функции для работы с SMS
  const requestSmsCode = () => {
    // В реальном приложении здесь был бы запрос к API
    smsCode.value = Math.floor(1000 + Math.random() * 9000).toString()
    resendCountdown.value = 60
    
    // Таймер обратного отсчета
    const timer = setInterval(() => {
      resendCountdown.value--
      if (resendCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    // Имитация отправки SMS
    console.log('SMS code:', smsCode.value)
    alert('Код подтверждения: ' + smsCode.value)
  }
  
  // Отправка перевода
  const submitTransfer = () => {
    // Проверяем код SMS
    if (smsVerificationCode.value !== smsCode.value) {
      errorMessage.value = 'Неверный код подтверждения. Попробуйте еще раз.'
      smsVerificationCode.value = ''
      transferSuccess.value = false
      currentStep.value = 5
      return
    }
    
    // В реальном приложении здесь был бы запрос к API
    const numericAmount = parseFloat(amount.value.replace(/\s/g, ''))
    
    // Имитация успешного перевода
    setTimeout(() => {
      // Обновляем баланс карт
      const fromCard = userCards.value.find(c => c.id === selectedFromCard.value)
      if (fromCard) {
        fromCard.balance -= numericAmount
      }
      
      if (recipientType.value === 'myCard') {
        const toCard = userCards.value.find(c => c.id === selectedToCard.value)
        if (toCard) {
          toCard.balance += numericAmount
        }
      }
      
      transferSuccess.value = true
      currentStep.value = 5
      
      // Уведомляем родительский компонент об успешном переводе
  emit('success', {
    fromCardId: selectedFromCard.value,
    toCardId: selectedToCard.value,
    amount: numericAmount,
    date: getCurrentDate(),
    transactionId: generateTransactionId()
  })
}, 1500)
}

// Открытие квитанции
const openReceipt = () => {
  // В реальном приложении здесь была бы логика для просмотра или загрузки квитанции
  alert('Функция просмотра квитанции будет доступна позднее')
}

// Проверяем наличие данных для инициализации при монтировании компонента
onMounted(() => {
  // Проверка и установка начальной карты, если указана в пропсах
  if (props.initialCardId) {
    const cardId = typeof props.initialCardId === 'string'
      ? parseInt(props.initialCardId)
      : props.initialCardId
    
    const card = userCards.value.find(c => c.id === cardId)
    if (card) {
      selectedFromCard.value = card.id
    }
  }
  
  // Прекращение показа лоадера, если он был
  // loading.value = false
})

// Следим за изменениями выбранных карт
watch([selectedFromCard], () => {
  // Если выбрана та же карта, что и для получения, сбрасываем выбор получателя
  if (selectedToCard.value === selectedFromCard.value) {
    selectedToCard.value = null
  }
})

// Сброс формы при закрытии
const resetForm = () => {
  currentStep.value = 1
  selectedFromCard.value = props.initialCardId ? 
    (typeof props.initialCardId === 'string' ? parseInt(props.initialCardId) : props.initialCardId) : 
    null
  selectedToCard.value = null
  recipientType.value = 'myCard'
  recipientCardNumber.value = ''
  recipientPhone.value = ''
  amount.value = ''
  comment.value = ''
  smsCode.value = ''
  smsVerificationCode.value = ''
  resendCountdown.value = 0
  transferSuccess.value = true
  errorMessage.value = ''
}

// Метод для закрытия модала с сохранением состояния после успешного перевода
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.transfer-form-container {
  background-color: #1A1A1A;
  border-radius: 16px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
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
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.form-content {
  position: relative;
}

.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
}

/* Стили для списка карт */
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.card-option {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border: 1px solid transparent;
}

.card-option:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.card-option.selected {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 107, 107, 0.4);
}

.card-option-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-right: 12px;
  position: relative;
  transition: all 0.2s;
}

.card-option-indicator.active::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #FF6B6B;
}

.card-option-type {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.card-option-number {
  font-weight: 500;
  margin-bottom: 4px;
}

.card-option-balance {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

/* Стили для действий формы */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.cancel-button, .back-button {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover, .back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.next-button, .submit-button {
  background: linear-gradient(135deg, #FF6B6B, #FFD166);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.next-button:hover, .submit-button:hover {
  box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
  transform: translateY(-2px);
}

.next-button:disabled, .submit-button:disabled {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

/* Стили для вкладок получателя */
.recipient-tabs {
  display: flex;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 16px;
}

.recipient-tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.recipient-tab.active {
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 500;
}

.recipient-section {
  margin-bottom: 24px;
}

/* Стили для полей ввода */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: white;
  font-size: 16px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: rgba(255, 107, 107, 0.5);
  background-color: rgba(255, 255, 255, 0.12);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Стили для поля суммы */
.amount-group {
  margin-top: 24px;
}

.amount-input-wrapper {
  position: relative;
}

.amount-input {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  padding-right: 40px;
}

.currency-symbol {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.commission-info {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 16px;
}

/* Стили для деталей перевода */
.transfer-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.transfer-from, .transfer-to {
  flex: 1;
}

.transfer-arrow {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 12px;
}

.detail-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.detail-value {
  font-weight: 500;
}

/* Стили для подтверждения */
.confirmation-box {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.confirmation-row {
  display: flex;
  margin-bottom: 12px;
}

.confirmation-row:last-child {
  margin-bottom: 0;
}

.confirmation-label {
  flex: 1;
  color: rgba(255, 255, 255, 0.6);
}

.confirmation-value {
  flex: 2;
  font-weight: 500;
}

.confirmation-value.highlight {
  color: #FF6B6B;
  font-weight: 600;
}

/* Стили для SMS верификации */
.sms-request {
  text-align: center;
  margin-bottom: 16px;
}

.sms-request p {
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.sms-button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sms-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.sms-verification {
  margin-bottom: 16px;
}

.resend-timer {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
}

.resend-link {
  text-align: center;
  font-size: 14px;
  color: #FF6B6B;
  margin-top: 8px;
  cursor: pointer;
  transition: color 0.2s;
}

.resend-link:hover {
  color: #FFD166;
  text-decoration: underline;
}

/* Стили для результатов */
.result-step {
  text-align: center;
}

.success-icon, .error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 20px;
}

.success-icon {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10B981;
}

.error-icon {
  background-color: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.result-detail {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
}

.result-details {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.result-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.result-row:last-child {
  margin-bottom: 0;
}

.result-label {
  color: rgba(255, 255, 255, 0.6);
}

.result-value {
  font-weight: 500;
}

.close-result-button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.close-result-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.receipt-button {
  background: linear-gradient(135deg, #FF6B6B, #FFD166);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.receipt-button:hover {
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.result-actions {
  justify-content: center;
  gap: 16px;
}
</style>