<template>
  <div
    class="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-full sm:max-w-lg md:max-w-3xl mx-auto"
  >
    <h2 class="text-2xl font-bold mb-6 text-indigo-300 text-center sm:text-left">
      {{ isEditing ? 'Modifica Gioco' : 'Aggiungi Nuovo Gioco' }}
    </h2>
    <form @submit.prevent="saveGame" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="title" class="block text-sm font-semibold text-gray-300 mb-1">Titolo</label>
          <input id="title" v-model="gameData.title" type="text" required class="input w-full" />
        </div>

        <div>
          <label for="genere" class="block text-sm font-semibold text-gray-300 mb-1">Genere</label>
          <select id="genere" v-model="gameData.genere" required class="input w-full">
            <option value="">Seleziona un genere</option>
            <option v-for="genere in knowngeneres" :key="genere" :value="genere">
              {{ genere }}
            </option>
          </select>
        </div>

        <div>
          <label for="console" class="block text-sm font-semibold text-gray-300 mb-1">
            Console
          </label>
          <select id="console" v-model="gameData.console" required class="input w-full">
            <option value="">Seleziona una console</option>
            <option v-for="console in knownConsoles" :key="console" :value="console">
              {{ console }}
            </option>
          </select>
        </div>

        <div>
          <label for="releaseYear" class="block text-sm font-semibold text-gray-300 mb-1">
            Uscita (italia)
          </label>
          <input id="releaseYear" v-model="gameData.released_at" type="date" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label for="softwareHouse" class="block text-sm font-semibold text-gray-300 mb-1">
            Software House
          </label>
          <input id="softwareHouse" v-model="gameData.developer" type="text" class="input w-full" />
        </div>

        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-semibold text-gray-300 mb-1">
            Descrizione
          </label>
          <textarea
            id="description"
            v-model="gameData.description"
            rows="4"
            class="input w-full"
          ></textarea>
        </div>

        <div class="md:col-span-2">
          <label for="cover" class="block text-sm font-semibold text-gray-300 mb-1">
            URL Copertina
          </label>
          <input id="cover" v-model="gameData.cover" type="text" class="input w-full" />
        </div>
      </div>

      <h3 class="text-xl font-bold text-indigo-300">Media</h3>
      <div
        v-for="(media, index) in gameData.media"
        :key="index"
        class="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-2"
      >
        <select v-model="media.type" class="input w-full sm:w-auto">
          <option value="image">Immagine</option>
          <option value="youtube">YouTube</option>
        </select>
        <input
          v-model="media.url"
          type="text"
          placeholder="URL del media"
          class="input flex-1 w-full"
        />
        <button
          type="button"
          @click="removeMedia(index)"
          class="text-red-500 hover:text-red-700 self-start sm:self-auto"
        >
          ✕
        </button>
      </div>
      <button type="button" @click="addMedia" class="btn-secondary w-full sm:w-auto mb-6">
        Aggiungi Media
      </button>

      <h3 class="text-xl font-bold text-indigo-300">Valutazioni</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="key in Object.keys(gameData.rating).filter(
            k => ratingLabels[k] && k !== 'general'
          )"
          :key="key"
          class="flex items-center"
        >
          <label class="block text-sm font-semibold text-gray-300 w-28 capitalize">
            {{ ratingLabels[key] }}:
          </label>
          <StarRating
            :rating="gameData.rating[key]"
            @update:rating="gameData.rating[key] = $event"
            editable
          />
        </div>

        <!-- Input number per Apprezzamento (general) -->
        <div class="flex items-center gap-3">
          <label class="block text-sm font-semibold text-gray-300 w-28 capitalize">
            {{ ratingLabels.general }}:
          </label>
          <input
            type="number"
            min="1"
            max="10"
            step="0.1"
            v-model.number="gameData.rating.general"
            class="input w-14 text-center"
          />
          <span>/10</span>
        </div>
      </div>

      <div class="flex flex-col w-full sm:flex-row items-center gap-4 mt-4">
        <div class="flex w-full justify-evenly">
          <label class="inline-flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              v-model="gameData.is_completed"
              class="form-checkbox text-indigo-600"
            />
            Completato
          </label>
          <label class="inline-flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              v-model="gameData.is_platinated"
              class="form-checkbox text-indigo-600"
            />
            Platinato
          </label>
        </div>
        <div class="flex w-full justify-evenly">
          <label class="inline-flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              v-model="gameData.is_psplus"
              class="form-checkbox text-indigo-600"
            />
            PS+
          </label>
          <label class="inline-flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              v-model="gameData.is_digital"
              class="form-checkbox text-indigo-600"
            />
            Digitale
          </label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <button type="submit" class="btn-primary w-full sm:w-auto">
          {{ isEditing ? 'Salva Modifiche' : 'Aggiungi Gioco' }}
        </button>
        <button type="button" @click="$emit('game-saved')" class="btn-secondary w-full sm:w-auto">
          Annulla
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits, toRef } from 'vue'
import { useGameStore } from '../stores/gameStore'
import StarRating from './StarRating.vue'

const props = defineProps({
  gameToEdit: Object,
})

const emit = defineEmits(['game-saved'])
const gameStore = useGameStore()
console.log(props.gameToEdit)

const knowngeneres = ref([
  'Adventure',
  'Action-Adventure',
  'Action RPG',
  'JRPG',
  'Picchiaduro',
  'Horror',
  'Platform',
  'FPS',
  'Rhythm',
  'Sport',
  'Puzzle',
  'Survival',
  'Arcade',
  'Stealth',
])

const knownConsoles = ref(['PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PC', 'GBA', 'Wii', 'NDS'])

const defaultGameData = {
  id: null,
  title: '',
  genere: '',
  console: '',
  released_at: null, // nome DB per data uscita
  developer: '',
  description: '',
  cover: '',
  is_completed: false, // nome DB per completato
  is_platinated: false, // nome DB per platinato
  media: [],
  rating: {
    graphic: 0,
    story: 0,
    audio: 0,
    gameplay: 0,
    general: 0,
  },
  is_psplus: false,
  is_digital: false,
}

const ratingLabels = {
  graphic: 'Grafica',
  story: 'Storia',
  audio: 'Audio',
  gameplay: 'Gameplay',
  general: 'Voto',
}

const gameData = reactive(props.gameToEdit ? { ...props.gameToEdit } : { ...defaultGameData })
const isEditing = toRef(!!props.gameToEdit)

const addMedia = () => {
  if (gameData.media) {
    gameData.media.push({ type: 'image', url: '' })
  } else {
    gameData.media = [{ type: 'image', url: '' }]
  }
}

const removeMedia = index => {
  gameData.media.splice(index, 1)
}

const saveGame = async () => {
  console.log('Valore is_completed prima update:', gameData.is_completed) // DEBUG

  if (gameData.genere && !knowngeneres.value.includes(gameData.genere)) {
    knowngeneres.value.push(gameData.genere)
    knowngeneres.value.sort((a, b) => a.localeCompare(b))
  }
  if (gameData.console && !knownConsoles.value.includes(gameData.console)) {
    knownConsoles.value.push(gameData.console)
    knownConsoles.value.sort((a, b) => a.localeCompare(b))
  }

  if (isEditing.value) {
    await gameStore.updateGame(gameData)
  } else {
    await gameStore.addGame({ ...gameData, id: Date.now().toString() })
  }

  emit('game-saved')
  Object.assign(gameData, { ...defaultGameData })
}

watch(
  () => props.gameToEdit,
  newVal => {
    if (newVal) {
      Object.assign(gameData, newVal)
    } else {
      Object.assign(gameData, defaultGameData)
    }
  }
)
</script>

<style scoped>
.input {
  @apply p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400;
}
.btn-primary {
  @apply bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300;
}
.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300;
}
</style>
