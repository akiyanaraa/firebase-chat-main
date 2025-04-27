<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Navbar from "@/components/Navbar.vue";
import { useChat } from "@/firebase.js";
import Message from "@/pages/chat/Message.vue";

const { messages, sendMessage } = useChat()
const messageList = computed(() => messages.value.slice().reverse())

const message = ref('')
const input = ref(null)

onMounted(() => {
  input.value.focus()
})

const isDark = ref(false)

watch(isDark, (newVal) => {
  const root = document.documentElement
  if (newVal) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
}

function send() {
  if (!message.value || message.value.trim().length === 0) return;
  sendMessage(message.value);
  message.value = '';
  nextTick(() => {
    input.value.focus();
  });
}

const bottom = ref(null)

watch(messages, () => {
  nextTick(() => {
    // Прокрутка в самый низ только если пользователь не прокручивает вверх
    const bottomElement = bottom.value;
    if (bottomElement) {
      bottomElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
}, { deep: true })

// Обработка прокрутки, чтобы избежать автоматической прокрутки, если пользователь прокручивает вверх
let userScrolledUp = false;

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollHeight - scrollTop === clientHeight) {
    userScrolledUp = false;
  } else {
    userScrolledUp = true;
  }
};
</script>

<template>
  <div :class="isDark ? 'text-white bg-gray-900' : 'text-black bg-blue-100'" class="min-h-screen flex flex-col">
    <Navbar />

    <!-- Переключатель темы -->
    <div class="flex justify-end px-5 mt-3">
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="isDark" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-600 rounded-full peer dark:peer-checked:bg-blue-600 transition-all duration-300 ease-in-out"></div>
        <div class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-full"></div>
        <span class="ml-3 text-sm font-medium">Dark Mode</span>
      </label>
    </div>

    <!-- Чат -->
    <div class="flex-1 flex flex-col md:mx-40 mx-5 mt-5 md:px-5 px-3 py-5 bg-blue-400 dark:bg-gray-800 rounded-lg overflow-hidden">
      <div 
        class="flex-1 flex flex-col bg-repeat bg-[url('assets/bg.jpg')] bg-opacity-25 dark:bg-gray-700 dark:bg-none rounded p-2 md:p-5 overflow-auto space-y-5"
        @scroll="handleScroll"
      >
        <Message v-for="(message, index) in messageList" :key="index" :message="message" />
        <div ref="bottom"></div>
      </div>

      <!-- Поле ввода -->
      <div class="px-2 py-3 bg-blue-200 dark:bg-gray-600 mt-2 rounded">
        <div class="flex items-center">
          <input
            ref="input"
            v-model="message"
            class="input-text rounded rounded-r-none w-full dark:bg-gray-800 dark:placeholder-gray-400"
            :class="{'text-black dark:text-white': true, 'bg-white dark:bg-gray-800': true}"
            @keyup.enter="send"
          />
          <button 
            @click="send" 
            class="btn btn-info rounded-l-none ml-2 dark:bg-blue-700 dark:text-white"
            :disabled="!message.trim()"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toggle-checkbox {
  display: none;
}

.min-h-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.flex-1 {
  flex-grow: 1;
  overflow-y: auto; /* Прокрутка только внутри этого контейнера */
}

input {
  max-width: 100%;
}

.bg-blue-400, .dark\:bg-gray-800 {
  max-height: calc(100vh - 160px); /* Ограничение высоты */
  overflow-y: auto; /* Прокрутка для чата */
}

button {
  padding: 10px 15px;
}
</style>
