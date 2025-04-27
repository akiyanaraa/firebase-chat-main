<script setup>
import { computed } from 'vue';
import { useAuth } from "@/firebase.js";

const { user } = useAuth();

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const messageHour = computed(() => {
  const date = new Date(props.message.createdAt.seconds * 1000);
  return date.toLocaleTimeString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
  });
})

function convertTimestamp(timestamp) {
  const date = timestamp.toDate();
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <div v-if="user?.uid !== message.uid" class="flex w-full mt-2 space-x-3 max-w-sm">
    <div class="flex items-start justify-start gap-2 w-96">
      <NAvatar :src="message.photoURL || undefined" round>
        <template v-if="!message.photoURL">
          {{ message.displayName?.charAt(0).toUpperCase() || 'A' }}
        </template>
      </NAvatar>

      <div class="flex-1 items-center justify-start gap-2">
        <span class="font-semibold">{{ message.displayName ?? 'Anonymous' }}</span>
        <div
          class="bg-gradient-to-br from-cyan-600 to-blue-600 p-2 text-justify text-white rounded-lg rounded-tl-none shadow-lg">
          {{ message.text }}
        </div>
        <span class="text-gray-400 italic text-xs">
          {{ convertTimestamp(message.createdAt) }}
        </span>
      </div>
    </div>
  </div>

  <div v-else class="flex w-full mt-2 space-x-3 max-w-sm ml-auto justify-end">
    <div class="flex flex-row-reverse items-start justify-end gap-2 w-96">
      <NAvatar :src="message.photoURL || undefined" round>
        <template v-if="!message.photoURL">
          {{ message.displayName?.charAt(0).toUpperCase() || 'A' }}
        </template>
      </NAvatar>

      <div class="flex-1 items-center justify-end gap-2 text-right">
        <div
          class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 text-justify text-white rounded-lg rounded-tr-none shadow-lg">
          {{ message.text }}
        </div>
        <span class="text-gray-400 italic text-xs">
          {{ convertTimestamp(message.createdAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Убираем стили для упоминаний */
a {
  text-decoration: none;
  cursor: default;
}
</style>
