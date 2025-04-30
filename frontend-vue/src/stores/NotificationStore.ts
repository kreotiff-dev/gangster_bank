import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);

  /**
   * Показать новое уведомление
   */
  function showNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString();
    const newNotification = {
      id,
      ...notification,
      duration: notification.duration || 3000
    };
    
    notifications.value.push(newNotification);
    
    // Автоматически скрываем уведомление через указанное время
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  }
  
  /**
   * Удалить уведомление по ID
   */
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }
  
  /**
   * Удалить все уведомления
   */
  function clearAllNotifications() {
    notifications.value = [];
  }
  
  /**
   * Вспомогательные методы для быстрого создания уведомлений разных типов
   */
  function success(title: string, message: string, duration?: number) {
    return showNotification({ type: 'success', title, message, duration });
  }
  
  function error(title: string, message: string, duration?: number) {
    return showNotification({ type: 'error', title, message, duration });
  }
  
  function info(title: string, message: string, duration?: number) {
    return showNotification({ type: 'info', title, message, duration });
  }
  
  function warning(title: string, message: string, duration?: number) {
    return showNotification({ type: 'warning', title, message, duration });
  }
  
  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    info,
    warning
  };
});