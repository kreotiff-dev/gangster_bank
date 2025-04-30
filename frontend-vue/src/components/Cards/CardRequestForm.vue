<template>
    <AppLayout>
      <div class="card-request-container">
        <div class="back-button-container">
          <button @click="router.back()" class="back-button">
            <span class="back-icon">←</span>
            <span>Назад</span>
          </button>
        </div>
  
        <h1 class="page-title">Заказ новой карты</h1>
        
        <form @submit.prevent="submitCardRequest" class="card-request-form">
          <!-- Выбор типа карты -->
          <div class="form-group">
            <label class="form-label">Тип карты</label>
            <div class="card-type-selector">
              <div 
                class="card-type-option"
                :class="{ active: cardType === 'debit' }"
                @click="cardType = 'debit'"
              >
                <div class="card-type-icon">💳</div>
                <div class="card-type-details">
                  <h3>Дебетовая карта</h3>
                  <p>Для повседневных расходов</p>
                </div>
              </div>
              
              <div 
                class="card-type-option"
                :class="{ active: cardType === 'credit' }"
                @click="cardType = 'credit'"
              >
                <div class="card-type-icon">💰</div>
                <div class="card-type-details">
                  <h3>Кредитная карта</h3>
                  <p>С кредитным лимитом</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Выбор категории карты -->
          <div class="form-group">
            <label for="cardCategory" class="form-label">Категория карты</label>
            <select v-model="cardCategory" id="cardCategory" class="form-select">
              <option value="Standard">Стандартная</option>
              <option value="Gold">Золотая</option>
              <option value="Platinum">Платиновая</option>
              <option value="Virtual">Виртуальная</option>
            </select>
          </div>
          
          <!-- Валюта карты -->
          <div class="form-group">
            <label for="currency" class="form-label">Валюта</label>
            <select v-model="currency" id="currency" class="form-select">
              <option value="₽">Рубли (₽)</option>
              <option value="$">Доллары ($)</option>
              <option value="€">Евро (€)</option>
            </select>
          </div>
          
          <!-- Для кредитной карты - кредитный лимит -->
          <div v-if="cardType === 'credit'" class="form-group">
            <label for="cardLimit" class="form-label">Кредитный лимит</label>
            <div class="limit-slider-container">
              <input 
                type="range" 
                id="cardLimit" 
                v-model="cardLimit" 
                min="10000" 
                max="300000" 
                step="10000" 
                class="limit-slider"
              >
              <div class="limit-value">{{ formatCurrency(cardLimit) }}</div>
            </div>
          </div>
          
          <!-- Имя и фамилия владельца карты -->
          <div class="form-group">
            <label for="cardholderFirstname" class="form-label">Имя владельца</label>
            <input 
              type="text" 
              id="cardholderFirstname" 
              v-model="cardholderFirstname" 
              class="form-input"
              placeholder="Имя на карте"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="cardholderLastname" class="form-label">Фамилия владельца</label>
            <input 
              type="text" 
              id="cardholderLastname" 
              v-model="cardholderLastname" 
              class="form-input"
              placeholder="Фамилия на карте"
              required
            >
          </div>
          
          <!-- Согласие с условиями -->
          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="termsAgreement" 
              v-model="termsAgreed" 
              class="checkbox-input"
              required
            >
            <label for="termsAgreement" class="checkbox-label">
              Я согласен с условиями выпуска и обслуживания карты
            </label>
          </div>
          
          <!-- Кнопки управления формой -->
          <div class="form-actions">
            <button type="button" @click="router.back()" class="cancel-button">
              Отмена
            </button>
            <button type="submit" class="submit-button" :disabled="isSubmitting">
              {{ isSubmitting ? 'Отправка...' : 'Заказать карту' }}
            </button>
          </div>
        </form>
        
        <!-- Модальное окно успешного создания -->
        <div v-if="showSuccessModal" class="modal-backdrop" @click="navigateToCards">
          <div class="modal-content success-modal" @click.stop>
            <div class="success-icon">✓</div>
            <h2 class="modal-title">Заявка принята!</h2>
            <p class="modal-text">Ваша карта создана и готова к использованию.</p>
            <button @click="navigateToCards" class="modal-button">
              Перейти к моим картам
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AppLayout from '@/components/Layout/AppLayout.vue'
  import { cardsApi } from '@/services/api'
  
  const router = useRouter()
  
  // Состояние формы
  const cardType = ref<'debit' | 'credit' | undefined>('debit')
  const cardCategory = ref('Standard')
  const currency = ref('₽')
  const cardLimit = ref(50000)
  const cardholderFirstname = ref('')
  const cardholderLastname = ref('')
  const termsAgreed = ref(false)
  const isSubmitting = ref(false)
  const showSuccessModal = ref(false)
  
  // Для тестирования - генерируем случайный номер карты
  const generateCardNumber = () => {
    // Генерируем случайный 16-значный номер карты
    // Первые 4 цифры зависят от типа карты: 4 для Visa, 5 для MasterCard
    const prefix = cardType.value === 'credit' ? '5' : '4'
    let cardNumber = prefix
    
    // Генерируем остальные 15 цифр
    for (let i = 0; i < 15; i++) {
      cardNumber += Math.floor(Math.random() * 10)
    }
    
    return cardNumber
  }
  
  // Генерируем срок действия карты (3 года от текущей даты)
  const generateExpirationDate = () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 3)
    return date.toISOString()
  }
  
  // Генерируем CVV
  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString()
  }
  
  // Отправка формы
  const submitCardRequest = async () => {
    if (!termsAgreed.value) {
      alert('Необходимо согласиться с условиями')
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Создаем объект с данными карты
      const cardData = {
        cardType: cardType.value,
        cardCategory: cardCategory.value,
        currency: currency.value,
        cardholderFirstname: cardholderFirstname.value,
        cardholderLastname: cardholderLastname.value,
        cardLimit: cardType.value === 'credit' ? cardLimit.value : undefined,
        
        // Автоматически генерируемые данные
        cardNumber: generateCardNumber(),
        expirationDate: generateExpirationDate(),
        cvv: generateCVV(),
        cardBalance: cardType.value === 'credit' ? 0 : 10000, // Для дебетовой карты даем стартовый баланс
        cardStatus: 'Active',
        lastUsageDate: new Date().toISOString(),
        securityParams: 'Default'
      }
      
      // Отправляем запрос на создание карты
      await cardsApi.createCard(cardData)
      
      // Показываем модальное окно успеха
      showSuccessModal.value = true
      
    } catch (error: any) {
      console.error('Ошибка создания карты:', error)
      alert('Не удалось создать карту: ' + (error.response?.data?.message || 'Произошла ошибка'))
    } finally {
      isSubmitting.value = false
    }
  }
  
  // Переход к списку карт
  const navigateToCards = () => {
    router.push('/cards')
  }
  
  // Форматирование суммы
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ru-RU') + ' ' + currency.value
  }
  </script>
  
  <style scoped>
  /* Импортируем темные стили */
  .card-request-container {
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
  
  .card-request-form {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    display: block;
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 8px;
  }
  
  .form-input, .form-select {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 14px 16px;
    color: white;
    font-size: 16px;
    transition: all 0.2s;
  }
  
  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: rgba(255, 107, 107, 0.5);
    background-color: rgba(255, 255, 255, 0.12);
  }
  
  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  .card-type-selector {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .card-type-option {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .card-type-option:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
  
  .card-type-option.active {
    background-color: rgba(255, 107, 107, 0.15);
    border-color: rgba(255, 107, 107, 0.4);
  }
  
  .card-type-icon {
    font-size: 24px;
  }
  
  .card-type-details h3 {
    font-size: 16px;
    margin-bottom: 4px;
  }
  
  .card-type-details p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .limit-slider-container {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .limit-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    outline: none;
  }
  
  .limit-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B6B, #FFD166);
    cursor: pointer;
    border: 2px solid white;
  }
  
  .limit-value {
    font-size: 16px;
    font-weight: 600;
    min-width: 100px;
    text-align: right;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .checkbox-input {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.08);
    position: relative;
  }
  
  .checkbox-input:checked {
    background-color: #FF6B6B;
    border-color: #FF6B6B;
  }
  
  .checkbox-input:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
  }
  
  .checkbox-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
  }
  
  .cancel-button {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .submit-button {
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
  
  .submit-button:hover {
    box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
    transform: translateY(-2px);
  }
  
  .submit-button:disabled {
    background: linear-gradient(135deg, #9ca3af, #6b7280);
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Модальное окно успеха */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    backdrop-filter: blur(4px);
  }
  
  .modal-content {
    background-color: #1A1A1A;
    border-radius: 16px;
    padding: 30px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    background-color: rgba(16, 185, 129, 0.2);
    color: #10B981;
    border-radius: 50%;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }
  
  .modal-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .modal-text {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 24px;
  }
  
  .modal-button {
    background: linear-gradient(135deg, #FF6B6B, #FFD166);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .modal-button:hover {
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }
  
  @media (max-width: 600px) {
    .card-type-selector {
      flex-direction: column;
    }
  }
  </style>