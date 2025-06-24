<template>
  <div>
    <!-- HEADER SEMPRE IN ALTO: Logo a sx + SearchBar al centro + Aggiungi gioco a dx (desktop) -->
    <div class="sticky top-0 z-40 bg-[#0c141b] p-3 sm:p-4 rounded-b-lg">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
        <!-- Titolo -->
        <span class="text-3xl sm:text-4xl font-bold text-center sm:text-left w-full sm:w-auto">
          DailyPad
        </span>

        <!-- SearchBar centrata su desktop, nascosta su mobile -->
        <SearchBar
          v-show="!isPortrait"
          class="sm:flex-grow sm:max-w-md mx-auto w-full"
          @update-filterPanel="toggleFilterPanel = !toggleFilterPanel"
        />

        <!-- Pulsante Aggiungi Gioco -->
        <button
          @click="showAddGameForm = true"
          class="bg-indigo-800 hover:bg-[#14202a] whitespace-nowrap font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 w-full sm:w-auto"
        >
          + Aggiungi gioco
        </button>
      </div>
    </div>

    <!-- BARRA IN BASSO SOLO SU SMARTPHONE: SearchBar + Filtri -->
    <div
      v-if="isPortrait"
      class="fixed bottom-0 left-0 w-full bg-[#0c141b] p-3 z-40 flex flex-col gap-3 shadow-lg"
    >
      <SearchBar class="w-full" @update-filterPanel="toggleFilterPanel = !toggleFilterPanel" />
    </div>

    <!-- Modale Aggiunta Gioco -->
    <div
      v-if="showAddGameForm"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-gray-800 rounded-lg p-6 relative w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 md:scale-100 transition-all duration-300"
      >
        <button
          @click="showAddGameForm = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-white transition duration-300"
          aria-label="Chiudi form aggiunta gioco"
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

    <!-- Modale Filtri -->
    <div
      v-if="toggleFilterPanel"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-lg relative">
        <button
          @click="toggleFilterPanel = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-white transition duration-300"
          aria-label="Chiudi pannello filtri"
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

    <!-- Contenuto -->
    <div class="pb-24 sm:pb-0">
      <GameGrid />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toggleFilterPanel = ref(false)
const showAddGameForm = ref(false)

function gameSaved() {
  showAddGameForm.value = false
}

const isPortrait = ref(window.innerHeight > window.innerWidth)

function handleResize() {
  isPortrait.value = window.innerHeight > window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
