<template>
    <Teleport to="body">
      <div class="notifications-container">
        <TransitionGroup name="notification">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification"
            :class="[`notification-${notification.type}`]"
          >
            <div class="notification-icon">
              <span v-if="notification.type === 'success'">✓</span>
              <span v-else-if="notification.type === 'error'">✗</span>
              <span v-else-if="notification.type === 'warning'">⚠</span>
              <span v-else>ℹ</span>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
            </div>
            <button @click="removeNotification(notification.id)" class="notification-close">
              &times;
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { useNotificationStore } from '@/stores/NotificationStore';
  import { storeToRefs } from 'pinia';
  
  const notificationStore = useNotificationStore();
  const { notifications } = storeToRefs(notificationStore);
  const { removeNotification } = notificationStore;
  </script>
  
  <style scoped>
  .notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 320px;
  }
  
  .notification {
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    background-color: #1A1A1A;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
  }
  
  .notification-success {
    border-left: 4px solid #10B981;
  }
  
  .notification-error {
    border-left: 4px solid #EF4444;
  }
  
  .notification-warning {
    border-left: 4px solid #F59E0B;
  }
  
  .notification-info {
    border-left: 4px solid #3B82F6;
  }
  
  .notification-icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 14px;
  }
  
  .notification-success .notification-icon {
    background-color: rgba(16, 185, 129, 0.2);
    color: #10B981;
  }
  
  .notification-error .notification-icon {
    background-color: rgba(239, 68, 68, 0.2);
    color: #EF4444;
  }
  
  .notification-warning .notification-icon {
    background-color: rgba(245, 158, 11, 0.2);
    color: #F59E0B;
  }
  
  .notification-info .notification-icon {
    background-color: rgba(59, 130, 246, 0.2);
    color: #3B82F6;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .notification-message {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  
  .notification-close:hover {
    color: white;
  }
  
  /* Анимации */
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .notification-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
  </style>