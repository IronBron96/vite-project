<template>
  <div
    @click="goToGameDetail"
    class="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
  >
    <!-- Game Cover Image -->
    <img
      :src="game.cover || 'https://placehold.co/400x600/1f2937/d1d5db?text=No+Cover'"
      :alt="`Copertina di ${game.title}`"
      class="w-full h-64 object-cover"
    />

    <!-- Completion and Platinum Status Icons -->
    <div class="absolute top-2 left-2 flex space-x-1">
      <Icon
        v-if="game.is_completed"
        icon="mdi:flag"
        class="w-6 h-6 border- rounded-full p-1 shadow-md bg-[#4e698fc7]"
        title="Campagna completata"
      />

      <Icon
        v-if="game.is_platinated"
        icon="mdi:trophy"
        class="w-6 h-6 border- rounded-full p-1 shadow-md bg-[#e6c847d0]"
        title="Campagna completata"
      />

      <Icon
        v-if="game.is_digital"
        icon="mdi:disc-alert"
        class="w-6 h-6 shadow-md text-[#e6c847d0]"
        title="PS+"
      />

      <Icon
        v-if="game.is_psplus"
        icon="mdi:plus"
        class="w-6 h-6 shadow-md text-[#e6c847d0]"
        title="PS+"
      />
    </div>

    <!-- Basic Game Information -->
    <div class="p-4">
      <h3 class="text-l font-bold text-indigo-500 mb-1 truncate">{{ game.title }}</h3>
      <p class="text-gray-300 text-sm mb-1 truncate">{{ game.genere }}</p>
      <p class="text-gray-400 text-xs truncate">{{ game.console }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter for navigation
import { Icon } from '@iconify/vue'

// Define the props that this component expects to receive
const props = defineProps({
  game: {
    type: Object,
    required: true,
    // Add a basic validator for the game object structure if desired
    validator: value => {
      return (
        typeof value.id === 'string' &&
        typeof value.title === 'string' &&
        typeof value.genere === 'string' &&
        typeof value.console === 'string'
        // Add more checks for other properties if strictly necessary
      )
    },
  },
})

// Get the router instance to programmatically navigate
const router = useRouter()

// Function to navigate to the game detail page when the card is clicked
const goToGameDetail = () => {
  router.push(`/game/${props.game.id}`)
}
</script>

<style scoped>
/* You can add specific styles for GameCard here if needed. */
</style>
