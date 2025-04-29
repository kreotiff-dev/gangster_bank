import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ConfirmCodeView from '@/views/ConfirmCodeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CardsView from '@/views/CardsView.vue'
import { useAuthStore } from '@/stores/authStore'
import { CardRequest } from '@/views/CardRequestView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/confirm-code', name: 'confirm-code', component: ConfirmCodeView },
  { path: '/personal-cabinet', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/cards', name: 'cards', component: CardsView, meta: { requiresAuth: true } },
  {
    path: '/cards/new',
    name: 'CardRequest',
    component: CardRequest, meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuth) {
    return '/login'
  }
})

export default router
