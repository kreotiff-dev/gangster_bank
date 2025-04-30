import type { InternalAxiosRequestConfig } from 'axios'
import type { User, Card, Transaction, TransferData } from '../types/index'
import axios from 'axios'

// Базовый URL для API запросов
const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ответов и ошибок
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    if (!error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    // Если ошибка 401 (неавторизован) и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Пробуем обновить токен
        const response = await axios.get('/api/auth/refresh', { withCredentials: true })
        const token = response.data.accessToken

        // Сохраняем новый токен
        localStorage.setItem('token', token)

        // Обновляем заголовок авторизации для исходного запроса
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
        }

        // Повторяем исходный запрос с новым токеном
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Если не удалось обновить токен, перенаправляем на страницу входа
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Интерфейсы для данных аутентификации
interface RegisterData {
  phone: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  phone: string;
  password: string;
}

interface ConfirmCodeData {
  code: string;
  phone: string;
}

interface AnalyticsParams {
  cardId?: number | string;
  period?: 'week' | 'month' | 'quarter' | 'year';
  [key: string]: any;
}

// API для аутентификации
export const authApi = {
  // Регистрация нового пользователя
  register(userData: RegisterData) {
    return apiClient.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/registration', userData)
  },

  // Подтверждение кода
  confirmCode(data: ConfirmCodeData) {
    return apiClient.post<{ message: string }>('/auth/confirm', data)
  },

  // Вход в систему
  login(credentials: LoginCredentials) {
    return apiClient.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', credentials)
  },

  // Выход из системы
  logout() {
    return apiClient.post<void>('/auth/logout')
  },

  // Обновление токена
  refreshToken() {
    return apiClient.get<{ user: User; accessToken: string; refreshToken: string }>('/auth/refresh', { withCredentials: true })
  }
}

// API для работы с пользователями
export const userApi = {
  // Получить всех пользователей (для админа)
  getUsers() {
    return apiClient.get<User[]>('/users')
  },

  // Получить данные пользователя по ID
  getUser(id: number | string) {
    return apiClient.get<User>(`/users/${id}`)
  },

  // Получить данные текущего пользователя
  getCurrentUser() {
    // Предполагаем, что у вас есть такой маршрут или используем id из хранилища
    const userId = localStorage.getItem('userId')
    if (!userId) {
      return Promise.reject(new Error('User ID not found in localStorage'))
    }
    return apiClient.get<User>(`/users/${userId}`)
  }
}

// API для работы с картами
export const cardsApi = {
  // Получить все карты пользователя
  getCards() {
    return apiClient.get<Card[]>('/cards')
  },

  // Получить общий баланс по всем картам
  getCardsBalance() {
    return apiClient.get<{ balance: number; currency: string }[]>('/cards/balance')
  },

  // Получить детали конкретной карты
  getCard(id: number | string) {
    return apiClient.get<Card>(`/cards/${id}`)
  },

  // Создать новую карту (заявка на выпуск)
  createCard(cardData: Partial<Card>) {
    return apiClient.post<Card>('/cards', cardData)
  },

  // Заблокировать карту
  blockCard(id: number | string) {
    return apiClient.patch<Card>(`/cards/${id}/block`)
  },

  // Запросить перевыпуск карты
  reissueCard(id: number | string) {
    return apiClient.patch<Card>(`/cards/${id}/reissue`)
  }
}

// API для работы с транзакциями
export const transactionsApi = {
  // Получить все транзакции пользователя
  getTransactions() {
    return apiClient.get<Transaction[]>('/transactions')
  },

  // Получить транзакции по конкретной карте
  getCardTransactions(cardId: number | string) {
    return apiClient.get<Transaction[]>(`/cards/${cardId}/transactions`)
  },

  // Выполнить перевод между картами
  createTransfer(transferData: TransferData) {
    return apiClient.post<{ message: string; transaction: Transaction; newBalance: number }>('/transactions/transfer', transferData)
  }
}

// API для работы с курсами валют
export const exchangeRatesApi = {
  // Получить текущие курсы валют
  getExchangeRates() {
    return apiClient.get<any>('/exchange-rates')
  }
}

// API для работы с аналитикой
export const analyticsApi = {
  // Получить аналитику расходов по категориям
  getCategoryAnalytics(params: AnalyticsParams = {}) {
    return apiClient.get<{ name: string; amount: number; category: string }[]>('/analytics/categories', { params })
  },

  // Получить аналитику по периодам
  getPeriodAnalytics(params: AnalyticsParams = {}) {
    return apiClient.get<{ period: string; income: number; expense: number }[]>('/analytics/periods', { params })
  }
}

export default {
  auth: authApi,
  user: userApi,
  cards: cardsApi,
  transactions: transactionsApi,
  exchangeRates: exchangeRatesApi,
  analytics: analyticsApi
}