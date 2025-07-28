<template>
  <div v-if="game" class="p-6 max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl my-8 relative">
    <!-- Close Button (X icon) -->
    <button
      @click="closeDetail"
      class="absolute top-3 right-3 text-gray-400 hover:text-white transition duration-300 z-10"
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

    <h1 class="text-4xl text-center font-bold text-indigo-500 mb-4">{{ game.title }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <img
          :src="game.cover || 'https://placehold.co/400x600/1f2937/d1d5db?text=No+Cover'"
          alt="Copertina del gioco"
          class="w-full max-h-[400px] object-contain rounded-lg shadow-md mb-4"
        />
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-if="game.completed"
            class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            Completato
          </span>
          <span
            v-if="game.platinized"
            class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Platinato
          </span>
        </div>
      </div>
      <div class="text-gray-200">
        <p class="mb-2 px-4">
          <strong class="text-indigo-300">Genere:</strong>
          {{ game.genere }}
        </p>
        <p class="mb-2 px-4">
          <strong class="text-indigo-300">Console:</strong>
          {{ game.console }}
        </p>
        <p class="mb-2 px-4">
          <strong class="text-indigo-300">Uscita (italia):</strong>
          {{ formatDate(game.releaseDate) }}
        </p>
        <p class="mb-4 px-4">
          <strong class="text-indigo-300">Software House:</strong>
          {{ game.developer }}
        </p>
        <p class="text-justify mb-6">{{ game.description }}</p>

        <h2 class="text-2xl font-bold text-indigo-500 mb-3">Valutazioni</h2>
        <div class="space-y-4 max-w-full md:max-w-none">
          <div class="flex items-center gap-8 max-w-full flex-wrap">
            <strong class="text-indigo-300 w-24 min-w-[100px]">Grafica:</strong>
            <StarRating
              :rating="game.ratings.graphic"
              @update:rating="updateRating('graphic', $event)"
              editable
            />
          </div>
          <div class="flex items-center gap-8 max-w-full flex-wrap">
            <strong class="text-indigo-300 w-24 min-w-[100px]">Storia:</strong>
            <StarRating
              :rating="game.ratings.story"
              @update:rating="updateRating('story', $event)"
              editable
            />
          </div>
          <div class="flex items-center gap-8 max-w-full flex-wrap">
            <strong class="text-indigo-300 w-24 min-w-[100px]">Sonoro:</strong>
            <StarRating
              :rating="game.ratings.audio"
              @update:rating="updateRating('audio', $event)"
              editable
            />
          </div>
          <div class="flex items-center gap-8 max-w-full flex-wrap">
            <strong class="text-indigo-300 w-24 min-w-[100px]">Gameplay:</strong>
            <StarRating
              :rating="game.ratings.gameplay"
              @update:rating="updateRating('gameplay', $event)"
              editable
            />
          </div>
          <div class="flex items-center gap-8 max-w-full flex-wrap">
            <strong class="text-indigo-300 w-24 min-w-[100px]">Voto:</strong>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              v-model.number="game.ratings.general"
              class="input w-20 text-center bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
    <h2 v-if="game.media && game.media.length" class="text-2xl font-bold text-indigo-300 mt-8 mb-3">
      Media
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(media, index) in game.media" :key="index">
        <template v-if="media.type === 'image'">
          <img
            :src="media.url || 'https://placehold.co/600x400/1f2937/d1d5db?text=No+Image'"
            alt="Media immagine"
            class="w-full rounded-lg shadow-md"
          />
        </template>
        <template v-else-if="media.type === 'youtube' && getYouTubeVideoId(media.url)">
          <div class="relative w-full" style="padding-bottom: 56.25%">
            <iframe
              class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              :src="'https://www.youtube.com/embed/' + getYouTubeVideoId(media.url)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </template>
      </div>
    </div>
    <div class="flex justify-center mt-8 gap-2">
      <button
        @click="editGame"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
      >
        Modifica Gioco
      </button>
      <button
        @click="confirmDelete"
        class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
      >
        Elimina Gioco
      </button>
    </div>
  </div>
  <div v-else class="text-center p-8 text-xl text-gray-400">Caricamento dettagli gioco...</div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import StarRating from './StarRating.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['edit-game'])

const game = ref(null)

const fetchGameDetails = id => {
  game.value = gameStore.getGameById(id)
  if (!game.value) {
    console.warn(`Gioco con ID ${id} non trovato.`)
  }
  console.log(game.value)
}

onMounted(() => {
  fetchGameDetails(route.params.id)
})

watch(
  () => route.params.id,
  newId => {
    fetchGameDetails(newId)
  }
)

const updateRating = async (category, newRating) => {
  if (game.value) {
    const updatedGame = { ...game.value }
    updatedGame.ratings = { ...updatedGame.ratings, [category]: newRating }
    await gameStore.updateGame(updatedGame)
    game.value = updatedGame
  }
}

const getYouTubeVideoId = url => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url?.match(regExp) || null
  return match && match[2] && match[2].length === 11 ? match[2] : null
}

const editGame = () => {
  if (game.value) {
    emit('edit-game', game.value)
  }
}

const confirmDelete = async () => {
  if (window.confirm(`Sei sicuro di voler eliminare il gioco "${game.value.title}"?`)) {
    await gameStore.deleteGame(game.value.id)
    router.push('/')
  }
}

function closeDetail() {
  router.push('/')
}

const formatDate = dateStr => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>
