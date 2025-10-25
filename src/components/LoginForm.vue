<template>
  <div class="bg-gray-800 p-6 rounded-lg max-w-sm mx-auto">
    <h2 class="text-xl font-bold text-indigo-300 mb-4">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 rounded bg-gray-700 text-white"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 rounded bg-gray-700 text-white"
      />
      <button
        type="submit"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded w-full"
      >
        Accedi
      </button>
    </form>
    <p v-if="error" class="text-red-400 mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    await userStore.login(email.value, password.value)
    router.push('/') // usa router.push per navigare senza ricaricare pagina
  } catch (err) {
    error.value = 'Email o password errati'
  }
}
</script>
