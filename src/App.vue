<script setup>
import {useAuth} from "@/firebase.js";
import Login from "@/pages/Login.vue";
import Index from "@/pages/chat/Index.vue";

const {isLogin} = useAuth();
</script>

<template>
  <div class="grid h-screen place-items-center mx-3 md:mx-0" v-if="!isLogin">
    <n-card class="max-w-md bg-blue-100">
      <template #header>
        <h1 class="text-xl font-bold text-center mb-2">Secure Firebase Chat</h1>
      </template>
      <Login />
      <div class="bg-transparent w-full h-10 flex items-center justify-center mt-5">
        <span class="text-gray-500">Only registered users can join</span>
      </div>
    </n-card>
  </div>
  <Index class="h-full" v-else />
</template>
