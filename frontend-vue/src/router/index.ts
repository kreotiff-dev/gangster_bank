import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router';
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ConfirmCodeView from '@/views/ConfirmCodeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CardsView from '@/views/CardsView.vue'
import { useAuthStore } from '@/stores/authStore'
import CardRequestForm from '@/views/CardRequestView.vue'
import CardDetailsView from '@/views/CardDetailsView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/confirm-code', name: 'confirm-code', component: ConfirmCodeView },
  { path: '/personal-cabinet', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/cards', name: 'cards', component: CardsView, meta: { requiresAuth: true } },
  {
    path: '/cards/:id',
    name: 'card-details',
    meta: { requiresAuth: true },
    component: CardDetailsView,
    props: (route: RouteLocationNormalized) => ({
      id: Number(route.params.id),
    }),
  },
  {
    path: '/cards/new',
    name: 'card-request',
    component: CardRequestForm, meta: { requiresAuth: true }
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
