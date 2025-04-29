<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 class="text-2xl font-bold text-center text-gray-800">Регистрация</h1>
  
        <form @submit.prevent="onRegister">
          <div v-for="field in fields" :key="field.model" class="relative">
            <label class="block text-gray-700 mb-1" :for="field.model">{{ field.label }}</label>
            <input
              v-model="form[field.model]"
              :id="field.model"
              :type="field.type"
              required
              class="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              v-if="enableGenerator"
              type="button"
              class="absolute top-7 right-2 text-blue-500 hover:text-blue-700 text-sm"
              @click="generateField(field.model)"
            >
              🎲
            </button>
          </div>
  
          <div class="flex space-x-2">
            <button
              type="button"
              @click="goBack"
              class="w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Назад
            </button>
            <button
              type="submit"
              class="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              :disabled="loading"
            >
              {{ loading ? 'Регистрируем...' : 'Продолжить' }}
            </button>
          </div>
  
          <p v-if="errorMessage" class="text-red-500 mt-4 text-center">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  
  const enableGenerator = true // Флаг генерации тест-данных
  const loading = ref(false)
  const errorMessage = ref('')
  
  const form = ref({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  
  type FormFields = keyof typeof form.value;
  
  const fields: { model: FormFields; label: string; type: string }[] = [
      { model: 'phone', label: 'Номер телефона', type: 'text' },
      { model: 'email', label: 'Email', type: 'email' },
      { model: 'firstName', label: 'Имя', type: 'text' },
      { model: 'lastName', label: 'Фамилия', type: 'text' },
      { model: 'password', label: 'Пароль', type: 'password' },
      { model: 'confirmPassword', label: 'Подтвердите пароль', type: 'password' }
  ];
  
  function generateField(field: string) {
    switch (field) {
      case 'phone':
        form.value.phone = generatePhone()
        break
      case 'email':
        form.value.email = generateEmail()
        break
      case 'firstName':
        form.value.firstName = generateName()
        break
      case 'lastName':
        form.value.lastName = generateName()
        break
      case 'password':
      case 'confirmPassword':
        const pwd = generatePassword()
        form.value.password = pwd
        form.value.confirmPassword = pwd
        break
    }
  }
  
  function generatePhone() {
    return '+7' + Math.floor(9000000000 + Math.random() * 99999999).toString()
  }
  
  function generateEmail() {
    return 'user' + Math.floor(Math.random() * 10000) + '@example.com'
  }
  
  function generateName() {
    const names = ['Алексей', 'Ирина', 'Дмитрий', 'Екатерина', 'Сергей', 'Мария']
    return names[Math.floor(Math.random() * names.length)]
  }
  
  function generatePassword() {
    return Math.random().toString(36).slice(-8)
  }
  
  async function onRegister() {
    if (form.value.password !== form.value.confirmPassword) {
      errorMessage.value = 'Пароли не совпадают'
      return
    }
  
    loading.value = true
    errorMessage.value = ''
  
    try {
      await axios.post('/api/auth/registration', {
        phone: form.value.phone,
        email: form.value.email,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        password: form.value.password,
      }, {
        withCredentials: true
      })
  
      router.push({ path: '/confirm', query: { phone: form.value.phone } })
    } catch (error) {
      errorMessage.value = 'Ошибка регистрации. Проверьте введённые данные.'
    } finally {
      loading.value = false
    }
  }
  
  function goBack() {
    router.push('/login')
  }
  </script>
  