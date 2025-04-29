import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { createPinia } from 'pinia'
import router from './router/index'
import { useAuthStore } from '@/stores/authStore'

async function bootstrap() {
  const app = createApp(App)

  const pinia = createPinia()
  app.use(pinia)

  const authStore = useAuthStore()
  await authStore.checkAuth()  // Сначала проверяем токены

  app.use(router) // Потом только роутер
  app.mount('#app')
}

bootstrap()
