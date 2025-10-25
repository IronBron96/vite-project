<template>
  <div
    class="relative p-6 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center overflow-hidden"
  >
    <!-- Frecce solo su desktop -->
    <button
      v-if="!isMobile && currentGameIndex > 0"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 text-4xl text-gray-400 hover:text-white transition"
      @click="prevGame"
    >
      ‹
    </button>

    <button
      v-if="!isMobile && currentGameIndex < store.games.length - 1"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-4xl text-gray-400 hover:text-white transition"
      @click="nextGame"
    >
      ›
    </button>

    <!-- Area swipe + animazione -->
    <transition :name="transitionName" mode="out-in">
      <div
        :key="currentGame?.id"
        class="w-full max-w-3xl"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <GameForm v-if="showEditForm" :gameToEdit="gameToEdit" @game-saved="handleGameSaved" />
        <GameDetail v-else-if="currentGame" :game="currentGame" @edit-game="handleEditGame" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import GameDetail from '@/components/GameDetail.vue'
import GameForm from '@/components/GameForm.vue'

const route = useRoute()
const router = useRouter()
const store = useGameStore()

const showEditForm = ref(false)
const gameToEdit = ref(null)
const currentGame = ref(null)
const currentGameIndex = ref(0)
const startX = ref(0)
const transitionName = ref('slide-left')

const isMobile = computed(() => window.innerWidth <= 768)

const isFirstLoad = ref(true)

// Carica giochi e imposta il gioco corrente
onMounted(async () => {
  if (store.games.length === 0) {
    await store.loadGames()
  }
  setCurrentGame()
})

// Aggiorna se cambia ID nella route
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (isFirstLoad.value) {
      transitionName.value = '' // niente animazione al primo caricamento
      isFirstLoad.value = false
    } else {
      setTransition(newId, oldId)
    }
    setCurrentGame()
  }
)

function setCurrentGame() {
  currentGameIndex.value = store.games.findIndex(g => g.id === route.params.id)
  currentGame.value = store.games[currentGameIndex.value] || null
}

// Determina la direzione della transizione
function setTransition(newId, oldId) {
  const newIndex = store.games.findIndex(g => g.id === newId)
  const oldIndex = store.games.findIndex(g => g.id === oldId)
  transitionName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
}

// Swipe su mobile
const startY = ref(0)

function handleTouchStart(e) {
  startX.value = e.changedTouches[0].clientX
  startY.value = e.changedTouches[0].clientY
}

function handleTouchEnd(e) {
  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY
  const diffX = startX.value - endX
  const diffY = startY.value - endY

  // Ignora swipe quasi verticali
  if (Math.abs(diffY) > Math.abs(diffX)) return

  // Aumenta la soglia per evitare tocchi accidentali
  if (Math.abs(diffX) > 120) {
    if (diffX > 0) nextGame()
    else prevGame()
  }
}

// Navigazione
function nextGame() {
  if (currentGameIndex.value < store.games.length - 1) {
    router.push(`/game/${store.games[currentGameIndex.value + 1].id}`)
  }
}

function prevGame() {
  if (currentGameIndex.value > 0) {
    router.push(`/game/${store.games[currentGameIndex.value - 1].id}`)
  }
}

// Edit funzioni
function handleEditGame(gameData) {
  gameToEdit.value = gameData
  showEditForm.value = true
}

function handleGameSaved() {
  showEditForm.value = false
  gameToEdit.value = null
  setCurrentGame()
}
</script>

<style scoped>
/* Animazioni slide */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
/* nessuna animazione se transitionName è vuota */
.enter-active,
.leave-active {
  transition: none !important;
}
</style>
