import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { createPinia } from 'pinia'
import router from './router/index'
import { useAuthStore } from '@/stores/authStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore()

authStore.checkAuth().finally(() => {
  app.mount('#app')
})