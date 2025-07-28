<template>
  <div class="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4 text-indigo-300 text-center sm:text-left">Filtri</h2>
    <div class="space-y-4">
      <div>
        <label for="genere" class="block text-gray-300 text-sm font-semibold mb-1">Genere</label>
        <select
          id="genere"
          v-model="filters.genere"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        >
          <option value="">Tutti i generi</option>
          <option value="Action-Adventure">Action-Adventure</option>
          <option value="Adventure">Adventure</option>
          <option value="Action RPG">Action RPG</option>
          <option value="Platform">Platform</option>
          <option value="Arcade">Arcade</option>
          <option value="Picchiaduro">Picchiaduro</option>
          <option value="Horror">Horror</option>
          <option value="FPS">FPS</option>
          <option value="JRPG">JRPG</option>
          <option value="Rhythm">Rhythm</option>
          <option value="Sport">Sport</option>
          <option value="Puzzle">Puzzle</option>
          <option value="Survival">Survival</option>
          <option value="Stealth">Stealth</option>
        </select>
      </div>
      <div>
        <label for="console" class="block text-gray-300 text-sm font-semibold mb-1">Console</label>
        <select
          id="console"
          v-model="filters.console"
          class="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        >
          <option value="">Tutte le console</option>
          <option value="PS5">PlayStation 5</option>
          <option value="PS4">PlayStation 4</option>
          <option value="PS3">PlayStation 3</option>
          <option value="PS2">PlayStation 2</option>
          <option value="PS1">PlayStation</option>
          <option value="PSP">PSP</option>
          <option value="GBA">GBA</option>
          <option value="Wii">Wii</option>
          <option value="NDS">NDS</option>
          <option value="PC">PC</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>
      <div class="flex justify-evenly">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_completed"
              v-model="filters.is_completed"
              class="form-checkbox h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            />
            <label for="is_completed" class="text-gray-300">Completato</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_platinated"
              v-model="filters.is_platinated"
              class="form-checkbox h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            />
            <label for="is_platinated" class="text-gray-300">Platinato</label>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_digital"
              v-model="filters.is_digital"
              class="form-checkbox h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            />
            <label for="is_digital" class="text-gray-300">Digital</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_psplus"
              v-model="filters.is_psplus"
              class="form-checkbox h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            />
            <label for="is_psplus" class="text-gray-300">PS+</label>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 flex flex-col sm:flex-row justify-end gap-2">
      <button
        @click="applyFilters"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 w-full sm:w-auto"
      >
        Applica Filtri
      </button>
      <button
        @click="clearFilters"
        class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 w-full sm:w-auto"
      >
        Cancella Filtri
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import { useGameStore } from '../stores/gameStore' // Importa lo store Pinia

const emit = defineEmits(['apply-filters', 'clear-filters'])

const gameStore = useGameStore()

// Inizializza i filtri locali con i valori attuali dello store
const filters = ref({
  genere: gameStore.filters.genere,
  console: gameStore.filters.console,
  is_completed: gameStore.filters.is_completed,
  is_platinated: gameStore.filters.is_platinated,
  is_digital: gameStore.filters.is_digital,
  is_psplus: gameStore.filters.is_psplus,
})

// Watch per aggiornare i filtri dello store ogni volta che i filtri locali cambiano
// Questo è importante per mantenere lo stato del form sincronizzato con lo store.
watch(
  filters,
  newFilters => {
    gameStore.setFilters(newFilters)
  },
  { deep: true }
)

const applyFilters = () => {
  gameStore.setFilters(filters.value) // Applica i filtri allo store
  emit('apply-filters') // Emette l'evento al genitore (es. per chiudere il modale)
}

const clearFilters = () => {
  // Resetta i filtri locali
  filters.value = {
    genere: '',
    console: '',
    is_completed: false,
    is_platinated: false,
    is_digital: false,
    is_psplus: false,
  }
  gameStore.clearFilters() // Chiama l'azione per cancellare i filtri nello store
  emit('clear-filters') // Emette l'evento al genitore
}
</script>
