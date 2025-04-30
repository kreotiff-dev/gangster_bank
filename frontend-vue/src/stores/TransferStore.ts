import { defineStore } from 'pinia';
import { transactionsApi } from '@/services/api';
import { useCardsStore } from '@/stores/CardsStore';
import type { TransferData } from '@/types';

interface TransferState {
  loading: boolean;
  error: string | null;
  success: boolean;
  latestTransactionId: string | null;
}

export const useTransferStore = defineStore('transfer', {
  state: (): TransferState => ({
    loading: false,
    error: null,
    success: false,
    latestTransactionId: null
  }),

  actions: {
    /**
     * Выполнить перевод между картами
     */
    async transferFunds(transferData: TransferData) {
        const cardsStore = useCardsStore();
        
        this.loading = true;
        this.error = null;
        this.success = false;
        
        try {
          const response = await transactionsApi.createTransfer(transferData);
          
          // Важно: обновляем список карт после успешного перевода
          await cardsStore.fetchCards();
          
          this.success = true;
          this.latestTransactionId = response.data.transaction.id.toString();
          
          return response.data;
        } catch (error: any) {
          this.error = error.response?.data?.message || 'Произошла ошибка при переводе средств';
          throw error;
        } finally {
          this.loading = false;
        }
      },
    
    /**
     * Запросить код SMS для подтверждения
     * В учебных целях создаем имитацию отправки SMS вместо запроса к API
     */
    async requestSmsCode(phoneNumber: string) {
      try {
        // Имитация запроса к серверу
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Возвращаем случайный 4-значный код
        const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        return {
          success: true,
          code: randomCode
        };
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Ошибка при запросе SMS-кода';
        throw error;
      }
    },
    
    /**
     * Сбросить состояние после завершения операции перевода
     */
    resetState() {
      this.loading = false;
      this.error = null;
      this.success = false;
    }
  }
});