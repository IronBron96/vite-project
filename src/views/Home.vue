<template>
  <div>
    <!-- Contenitore per SearchBar e pulsante Aggiungi Gioco -->
    <div class="sticky top-0 z-40 flex items-center bg-[#0c141b] rounded-lg p-4">
      <span class="text-4xl font-bold">DailyPad</span>
      <!-- SearchBar (che include già l'input e il pulsante filtro) -->
      <SearchBar class="ml-6" @update-filterPanel="toggleFilterPanel = !toggleFilterPanel" />

      <!-- Pulsante per aggiungere un gioco -->
      <button
        @click="showAddGameForm = true"
        class="bg-[##0c141b] hover:bg-[#0c141b] text-gray-300 text-nowrap font-semibold p-2 rounded-lg shadow-md transition duration-300"
      >
        + Aggiungi gioco
      </button>
    </div>

    <!-- Modale per il form di aggiunta gioco -->
    <div
      v-if="showAddGameForm"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-gray-800 rounded-lg p-6 relative max-w-xl w-full max-h-[90vh] overflow-y-auto transform scale-95 md:scale-100 transition-all duration-300"
      >
        <button
          @click="showAddGameForm = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-white transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <GameForm @game-saved="gameSaved" />
      </div>
    </div>

    <!-- Modale per il pannello filtri con sfondo oscurato -->
    <div
      v-if="toggleFilterPanel"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full relative">
        <button
          @click="toggleFilterPanel = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-white transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <FilterPanel
          @apply-filters="toggleFilterPanel = false"
          @clear-filters="toggleFilterPanel = false"
        />
      </div>
    </div>

    <div class="px-8">
      <GameGrid />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import directus, { getCurrentUser } from '../api/cms'
import { readItems, createItem } from '@directus/sdk'

const toggleFilterPanel = ref(false)
const showAddGameForm = ref(false)

function gameSaved() {
  showAddGameForm.value = false
}
</script>
