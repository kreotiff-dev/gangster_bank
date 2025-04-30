import { defineStore } from 'pinia';
import { cardsApi } from '@/services/api';
import type { Card } from '@/types';

interface CardsState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  selectedCardId: number | null;
}

export const useCardsStore = defineStore('cards', {
  state: (): CardsState => ({
    cards: [],
    loading: false,
    error: null,
    selectedCardId: null
  }),

  getters: {
    // Получение общего баланса по всем картам
    totalBalance: (state) => {
      return state.cards.reduce((total, card) => {
        if (card.cardBalance && card.currency === '₽') {
          return total + parseFloat(card.cardBalance.toString());
        }
        return total;
      }, 0);
    },

    // Получение списка дебетовых карт
    debitCards: (state) => {
      return state.cards.filter(card => card.cardType.toLowerCase() === 'debit');
    },

    // Получение списка кредитных карт
    creditCards: (state) => {
      return state.cards.filter(card => card.cardType.toLowerCase() === 'credit');
    },

    // Получение выбранной карты
    selectedCard: (state) => {
      if (!state.selectedCardId) return null;
      return state.cards.find(card => card.id === state.selectedCardId) || null;
    }
  },

  actions: {
    /**
     * Получить все карты пользователя
     */
    async fetchCards() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await cardsApi.getCards();
        this.cards = response.data;
        
        // Если карт нет, сбрасываем выбранную карту
        if (this.cards.length === 0) {
          this.selectedCardId = null;
        } 
        // Если есть карты, но нет выбранной, устанавливаем первую карту как выбранную
        else if (this.selectedCardId === null || !this.cards.find(card => card.id === this.selectedCardId)) {
          this.selectedCardId = this.cards[0].id;
        }
        
        return this.cards;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка при получении списка карт';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Получить данные конкретной карты
     */
    async fetchCard(id: number | string) {
      try {
        const response = await cardsApi.getCard(id);
        
        // Обновляем карту в списке или добавляем, если её там нет
        const index = this.cards.findIndex(card => card.id === response.data.id);
        if (index !== -1) {
          this.cards[index] = response.data;
        } else {
          this.cards.push(response.data);
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Ошибка при получении данных карты ${id}`;
        throw error;
      }
    },

    /**
     * Создать новую карту (заявка на выпуск)
     */
    async createCard(cardData: Partial<Card>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await cardsApi.createCard(cardData);
        
        // Добавляем новую карту в список
        this.cards.push(response.data);
        
        // Устанавливаем новую карту как выбранную
        this.selectedCardId = response.data.id;
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка при создании карты';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Заблокировать карту
     */
    async blockCard(id: number | string) {
      try {
        const response = await cardsApi.blockCard(id);
        
        // Обновляем статус карты в списке
        const index = this.cards.findIndex(card => card.id === response.data.id);
        if (index !== -1) {
          this.cards[index] = response.data;
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Ошибка при блокировке карты ${id}`;
        throw error;
      }
    },

    /**
     * Запросить перевыпуск карты
     */
    async reissueCard(id: number | string) {
      try {
        const response = await cardsApi.reissueCard(id);
        
        // Обновляем статус карты в списке
        const index = this.cards.findIndex(card => card.id === response.data.id);
        if (index !== -1) {
          this.cards[index] = response.data;
        }
        
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Ошибка при запросе перевыпуска карты ${id}`;
        throw error;
      }
    },

    /**
     * Установить выбранную карту
     */
    setSelectedCard(id: number | null) {
      this.selectedCardId = id;
    }
  }
});