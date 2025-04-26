<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">Подтверждение кода</h1>
  
        <p class="text-gray-600 mb-6">
          Мы отправили код на номер<br />
          <strong>{{ phone }}</strong>
        </p>
  
        <div class="flex justify-center gap-2 mb-6">
          <input
            v-for="(digit, index) in code"
            :key="index"
            v-model="code[index]"
            maxlength="1"
            class="w-12 h-12 text-center text-2xl border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="onInput(index)"
            ref="codeInputs"
          />
        </div>
  
        <button
          type="button"
          @click="goBack"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Назад
        </button>
  
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  
  // Допустим, номер передали через query-параметры
  const phone = ref<string>(router.currentRoute.value.query.phone as string || '+7XXXXXXXXXX')
  
  const code = ref<string[]>(['', '', '', '', ''])
  const codeInputs = ref<HTMLInputElement[]>([])
  
  const errorMessage = ref<string>('')
  
  function onInput(index: number) {
    const currentInput = codeInputs.value[index]
  
    if (currentInput.value.length > 1) {
      currentInput.value = currentInput.value.slice(0, 1)
    }
  
    if (currentInput.value && index < codeInputs.value.length - 1) {
      codeInputs.value[index + 1]?.focus()
    }
  
    if (code.value.every(d => d.length === 1)) {
      verifyCode()
    }
  }
  
  async function verifyCode() {
    const enteredCode = code.value.join('')
  
    try {
      const response = await axios.post('/api/auth/confirm-code', {
        phone: phone.value,
        code: enteredCode
      }, {
        withCredentials: true
      })
  
      if (response.status === 200) {
        router.push('/profile')
      } else {
        errorMessage.value = 'Неверный код. Попробуйте ещё раз.'
        clearCode()
      }
    } catch (error) {
      errorMessage.value = 'Ошибка проверки кода.'
      clearCode()
    }
  }
  
  function clearCode() {
    code.value = ['', '', '', '', '']
    nextTick(() => {
      codeInputs.value[0]?.focus()
    })
  }
  
  function goBack() {
    router.back()
  }
  </script>
  