import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuth: boolean
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuth: false,
    token: localStorage.getItem('token'),
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('/api/auth/login', { email, password }, {
          withCredentials: true,
        })

        const { accessToken, user } = response.data
        this.token = accessToken
        this.user = user
        this.isAuth = true

        localStorage.setItem('token', accessToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      } catch (error) {
        console.error('Ошибка входа:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuth = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async checkAuth() {
      try {
        const response = await axios.get('/api/auth/refresh', {
          withCredentials: true
        })

        const { accessToken, user } = response.data
        this.token = accessToken
        this.user = user
        this.isAuth = true

        localStorage.setItem('token', accessToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      } catch (error) {
        this.logout()
      }
    }
  }
})
