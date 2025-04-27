<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '@/firebase.js'

const { user, isLogin, signIn, logOut } = useAuth()
const visible = ref(false)

const toggle = () => {
  visible.value = !visible.value
}

const isDark = ref(false)

watch(isDark, (newVal) => {
  const root = document.documentElement
  if (newVal) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
})
</script>

<template>
  <nav class="flex items-center justify-between gap-2 h-16 pt-4 bg-transparent px-4">
    <!-- Текст по центру -->
    <div class="flex-1 text-center">
      <span class="font-bold">Firebase & VueJS ChatAPP</span>
    </div>

    <!-- Контейнер для кнопки выхода и переключателя темы -->
    <div class="flex items-center space-x-4">
      <!-- Кнопка выхода -->
      <button @click="logOut" class="btn btn-danger btn-sm text-right rounded-lg">
        Sign Out
      </button>
    </div>
  </nav>
</template>

<style scoped>
</style>
