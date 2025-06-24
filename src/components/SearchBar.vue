<template>
  <div class="flex flex-row justify-center gap-4 items-center w-full relative">
    <input
      type="text"
      placeholder="Cerca giochi..."
      v-model="searchTerm"
      class="flex-grow p-1.5 max-w-[500px] rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
    />
    <button
      @click="emit('update-filterPanel')"
      class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold p-2 rounded-lg shadow-md transition duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore' // Importa lo store Pinia

const emit = defineEmits(['update-filterPanel'])

const gameStore = useGameStore()

// Il termine di ricerca è ora collegato allo store Pinia
const searchTerm = ref(gameStore.searchTerm)

// Watch per aggiornare lo store Pinia ogni volta che searchTerm cambia
watch(searchTerm, newTerm => {
  gameStore.setSearchTerm(newTerm)
})
</script>
