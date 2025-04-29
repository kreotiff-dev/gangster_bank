import axios from 'axios'

// Базовый URL для API запросов
const API_URL = '/api'

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Для работы с куками (в которых хранится refreshToken)
})

// Интерцептор для добавления токена авторизации к запросам
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// API для работы с картами
export const cardsApi = {
  // Получить все карты пользователя
  getCards() {
    return apiClient.get('/cards')
  },

  // Получить общий баланс по всем картам
  getCardsBalance() {
    return apiClient.get('/cards/balance')
  },

  // Получить детали конкретной карты
  getCard(id) {
    return apiClient.get(`/cards/${id}`)
  },

  // Заблокировать карту
  blockCard(id) {
    return apiClient.patch(`/cards/${id}/block`)
  },

  // Запросить перевыпуск карты
  reissueCard(id) {
    return apiClient.patch(`/cards/${id}/reissue`)
  }
}

// API для работы с транзакциями
export const transactionsApi = {
  // Получить транзакции по конкретной карте
  getCardTransactions(cardId) {
    return apiClient.get(`/cards/${cardId}/transactions`)
  }
}

export default {
  cards: cardsApi,
  transactions: transactionsApi
}