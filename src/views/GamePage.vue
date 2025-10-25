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

    <!-- Wrapper con altezza dinamica e scroll abilitato -->
    <div class="relative w-full max-w-3xl flex-1 flex items-start justify-center">
      <transition :name="transitionName" mode="out-in">
        <div
          ref="scrollContainer"
          :key="currentGame?.id"
          class="absolute inset-0 w-full overflow-y-auto overscroll-contain touch-pan-y scroll-hidden"
          @scroll="saveScroll"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <GameForm v-if="showEditForm" :gameToEdit="gameToEdit" @game-saved="handleGameSaved" />
          <GameDetail v-else-if="currentGame" :game="currentGame" @edit-game="handleEditGame" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import GameDetail from '@/components/GameDetail.vue'
import GameForm from '@/components/GameForm.vue'
import { nextTick } from 'vue'

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

const scrollPosition = ref(0)
const scrollContainer = ref(null)

function saveScroll() {
  if (scrollContainer.value) {
    scrollPosition.value = scrollContainer.value.scrollTop
  }
}

function restoreScroll() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
  }
}

// Carica giochi e imposta il gioco corrente
onMounted(async () => {
  if (store.games.length === 0) {
    await store.loadGames()
  }
  setCurrentGame()

  // Se c'è un container principale scrollabile, lo resetta
  const mainContainer = document.querySelector('.main-scroll-container')
  if (mainContainer) {
    mainContainer.scrollTo({ top: 0, behavior: 'instant' })
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
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
  nextTick(() => restoreScroll())
}

// Determina la direzione della transizione
function setTransition(newId, oldId) {
  const newIndex = store.games.findIndex(g => g.id === newId)
  const oldIndex = store.games.findIndex(g => g.id === oldId)
  transitionName.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
}

// Swipe su mobile
const touchData = ref({ startX: 0, startY: 0, moved: false })

function handleTouchStart(e) {
  touchData.value = {
    startX: e.touches[0].clientX,
    startY: e.touches[0].clientY,
    moved: false,
  }
}

function handleTouchMove(e) {
  const deltaX = e.touches[0].clientX - touchData.value.startX
  const deltaY = e.touches[0].clientY - touchData.value.startY
  if (Math.abs(deltaX) > 10) touchData.value.moved = true

  // Blocca lo scroll verticale se il movimento è orizzontale deciso
  if (Math.abs(deltaX) > Math.abs(deltaY)) e.preventDefault()
}

function handleTouchEnd(e) {
  const deltaX = e.changedTouches[0].clientX - touchData.value.startX
  const deltaY = e.changedTouches[0].clientY - touchData.value.startY

  if (!touchData.value.moved || Math.abs(deltaY) > Math.abs(deltaX)) return

  if (deltaX < -120) nextGame()
  else if (deltaX > 120) prevGame()
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

.scroll-hidden {
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE e Edge legacy */
}

.scroll-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.relative > .absolute {
  top: 0;
  left: 0;
}
</style>
