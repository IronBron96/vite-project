<template>
  <div class="flex flex-col min-h-screen min-w-screen bg-gray-900 text-white">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { loginIfNeeded } from './api/cms'

onMounted(async () => {
  await loginIfNeeded()
})
</script>
