<script setup>
import { ref } from 'vue'
import { useAuth } from '@/firebase.js'

const { loginWithEmail, registerWithEmail } = useAuth()

const email = ref('')
const password = ref('')
const nickname = ref('')
const isRegistering = ref(false)
const error = ref('')

const submit = async () => {
  error.value = ''

  if (!email.value || !password.value || (isRegistering.value && !nickname.value)) {
    error.value = 'Все поля обязательны'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Неверный формат email'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  try {
    if (isRegistering.value) {
      await registerWithEmail(email.value, password.value, nickname.value)
    } else {
      await loginWithEmail(email.value, password.value)
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="space-y-3">
    <input v-model="email" type="email" placeholder="Email" class="input-text w-full" />
    <input v-model="password" type="password" placeholder="Password" class="input-text w-full" />
    <input
      v-if="isRegistering"
      v-model="nickname"
      type="text"
      placeholder="Nickname"
      class="input-text w-full"
    />

    <button @click="submit" class="btn btn-primary w-full">
      {{ isRegistering ? 'Register' : 'Login' }}
    </button>

    <p class="text-sm text-center text-blue-500 cursor-pointer" @click="isRegistering = !isRegistering">
      {{ isRegistering ? 'Already have an account? Login' : "Don't have an account? Register" }}
    </p>

    <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
  </div>
</template>
