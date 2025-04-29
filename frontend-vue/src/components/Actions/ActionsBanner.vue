<template>
  <div class="grid grid-cols-4 gap-2 bg-white rounded-lg p-4 shadow">
    <ActionButton 
      icon="💸" 
      label="Перевести"
      @action-click="openTransferModal"
    />
    <ActionButton 
      icon="+" 
      label="Пополнить"
      @action-click="handleAction('пополнить')"
    />
    <ActionButton 
      icon="📄" 
      label="Оплатить"
      @action-click="handleAction('оплатить')"
    />
    <ActionButton 
      icon="🏦" 
      label="Счета"
      @action-click="handleAction('счета')"
    />
    
    <!-- Модальное окно для формы перевода -->
    <Teleport to="body">
      <div v-if="showTransferModal" class="modal-backdrop" @click="showTransferModal = false">
        <div class="modal-content" @click.stop>
          <TransferFormComponent 
            :initialCardId="activeCardId" 
            @close="showTransferModal = false"
            @success="onTransferSuccess"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ActionButton from './ActionButton.vue'
import TransferFormComponent from '@/components/Transfer/TransferFormComponent.vue'

// Состояние для модального окна
const showTransferModal = ref(false)
// ID активной карты (можно получать из пропсов или из хранилища)
const activeCardId = ref(1)

// Открытие модального окна перевода
const openTransferModal = () => {
  showTransferModal.value = true
}

// Обработчик для других действий
const handleAction = (action: string) => {
  // Здесь будет логика для других действий
  alert(`Действие "${action}" будет доступно позднее`)
}

// Обработчик успешного перевода
const onTransferSuccess = (result: any) => {
  showTransferModal.value = false
  // Можно добавить обработку успешного перевода,
  // например, обновление данных или показ уведомления
  console.log('Перевод выполнен успешно:', result)
}
</script>

<style scoped>
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
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>