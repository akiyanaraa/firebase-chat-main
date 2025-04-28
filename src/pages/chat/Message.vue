<script setup>
import { computed, ref } from 'vue';
import { useAuth, useChat } from "@/firebase.js";

const { user } = useAuth();
const { editMessage } = useChat();
const { deleteMessage } = useChat();


const emit = defineEmits(['start-editing', 'stop-editing']); // ➔ добавили

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const isEditing = ref(false);  // Use this for editing state
const newText = ref(props.message.text);

const messageHour = computed(() => {
  const date = new Date(props.message.createdAt.seconds * 1000);
  return date.toLocaleTimeString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
  });
});

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

const startEditing = () => {
  isEditing.value = true;  // Устанавливаем редактирование
  emit('start-editing');
};

const cancelEditing = () => {
  isEditing.value = false; // Сбрасываем редактирование
  emit('stop-editing');
};

const saveEdit = async () => {
  if (!newText.value.trim()) return;
  await editMessage(props.message.id, newText.value); // Применяем фильтрацию в editMessage
  isEditing.value = false;  // Завершаем редактирование
  emit('stop-editing'); // Сообщаем, что редактирование завершено
};
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

        <div class="bg-gradient-to-br from-cyan-600 to-blue-600 p-2 text-justify text-white rounded-lg rounded-tl-none shadow-lg">
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

      <div class="flex-1 items-center justify-end gap-2 text-right group relative">
        <div class="flex items-center gap-2 justify-end">
          <!-- Кнопка Edit -->
          <div
            class="text-xs text-blue-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            @click="startEditing"
          >
            Edit
          </div>

          <!-- Кнопка Delete -->
          <div
            class="text-xs text-red-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            @click="deleteMessage(props.message.id)"
          >
            Delete
          </div>

        </div>

        <!-- Сообщение или редактирование -->
        <div v-if="!isEditing"
          class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 text-justify text-white rounded-lg rounded-tr-none shadow-lg">
          {{ message.text }}
          <span v-if="message.edited" class="text-xs italic ml-2">(edited)</span>
        </div>

        <div v-else
          class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 text-white rounded-lg rounded-tr-none shadow-lg">
          <input v-model="newText" class="input-text w-full text-black p-1 mb-1 rounded" />
          <div class="flex justify-end gap-2 mt-2">
            <button @click="saveEdit" class="btn btn-success btn-xs">Save</button>
            <button @click="cancelEditing" class="btn btn-danger btn-xs">Cancel</button>
          </div>
        </div>
      </div>

      <span class="text-gray-400 italic text-xs block mt-1">
        {{ convertTimestamp(message.createdAt) }}
      </span>
    </div>
  </div>
</template>


<style scoped>
a {
  text-decoration: none;
  cursor: default;
}
</style>
