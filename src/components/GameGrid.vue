<template>
  <div class="p-6">
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <GameCard v-for="game in filteredGames" :key="game.id" :game="game" />
    </div>
    <span v-if="!filteredGames || !filteredGames.length">0 giochi trovati</span>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '../stores/gameStore' // Importa lo store Pinia
import directus, { getCurrentUser } from '../api/cms'
import { readItems, createItem } from '@directus/sdk'

const gameStore = useGameStore()

// filteredGames è ora una computed property che legge direttamente dallo store
const filteredGames = computed(() => gameStore.filteredGames)

onMounted(async () => {
  gameStore.loadGames()
})
</script>
