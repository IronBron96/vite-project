import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import directus, { getCurrentUser } from '../api/cms' // Assicurati che questo import sia corretto
import { readItems, createItem, updateItem } from '@directus/sdk'

export const useGameStore = defineStore('gameStore', () => {
  const games = ref([])
  const searchTerm = ref('')
  const filters = ref({
    genere: '',
    console: '',
    is_completed: false,
    is_platinated: false,
    is_digital: false,
    is_psplus: false,
  })

  const loadGames = async () => {
    try {
      const response = await directus.request(
        readItems('dailypad', {
          limit: -1, // senza limiti
          sort: ['title'],
        })
      )
      games.value = response.map(game => ({
        id: game.id,
        title: game.title,
        genere: game.genere,
        console: game.console,
        released_at: game.released_at,
        completed_at: game.completed_at,
        platinated_at: game.platinated_at,
        developer: game.developer,
        description: game.description,
        is_completed: game.is_completed,
        is_platinated: game.is_platinated,
        is_psplus: game.is_psplus,
        is_digital: game.is_digital,
        rating: game.rating || {},
        media: game.media,
        cover: game.cover,
      }))
    } catch (error) {
      console.error('Errore nel caricamento dei giochi da Directus:', error)
      games.value = []
    }
  }

  const addGame = async newGame => {
    try {
      await directus.request(
        createItem('dailypad', {
          title: newGame.title,
          genere: newGame.genere,
          console: newGame.console,
          released_at: newGame.released_at,
          completed_at: newGame.is_completed ? new Date().toISOString() : null,
          platinated_at: newGame.is_platinated ? new Date().toISOString() : null,
          developer: newGame.developer,
          description: newGame.description,
          is_completed: newGame.is_completed,
          is_platinated: newGame.is_platinated,
          is_psplus: newGame.is_psplus,
          is_digital: newGame.is_digital,
          rating: newGame.rating,
          media: newGame.media,
          cover: newGame.cover,
        })
      )

      await loadGames()
    } catch (error) {
      console.error('Errore nel salvataggio del gioco:', error)
    }
  }

  const updateGame = async updatedGame => {
    try {
      await directus.request(
        updateItem('dailypad', updatedGame.id, {
          title: updatedGame.title,
          genere: updatedGame.genere,
          console: updatedGame.console,
          released_at: updatedGame.released_at,
          completed_at: updatedGame.is_completed ? new Date().toISOString() : null,
          platinated_at: updatedGame.is_platinated ? new Date().toISOString() : null,
          developer: updatedGame.developer,
          description: updatedGame.description,
          is_completed: updatedGame.is_completed,
          is_platinated: updatedGame.is_platinated,
          is_psplus: updatedGame.is_psplus,
          is_digital: updatedGame.is_digital,
          rating: updatedGame.rating,
          media: updatedGame.media,
          cover: updatedGame.cover,
        })
      )
      await loadGames()
    } catch (error) {
      console.error("Errore nell'aggiornamento del gioco:", error)
    }
  }

  const getGameById = id => games.value.find(game => game.id === id)

  const setSearchTerm = term => {
    searchTerm.value = term
  }

  const setFilters = newFilters => {
    filters.value = { ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      genere: '',
      console: '',
      is_completed: false,
      is_platinated: false,
      is_digital: false,
      is_psplus: false,
    }
  }

  const filteredGames = computed(() => {
    const term = searchTerm.value.toLowerCase()
    return games.value.filter(game => {
      const f = filters.value

      // Ricerca testuale
      if (
        term &&
        !(
          game.title?.toLowerCase().includes(term) ||
          game.genere?.toLowerCase().includes(term) ||
          game.console?.toLowerCase().includes(term) ||
          game.description?.toLowerCase().includes(term) ||
          game.developer?.toLowerCase().includes(term)
        )
      )
        return false

      // Filtri
      if (f.genere && game.genere !== f.genere) return false
      if (f.console && game.console !== f.console) return false
      if (f.is_completed && !game.is_completed) return false
      if (f.is_platinated && !game.is_platinated) return false
      if (f.is_digital && !game.is_digital) return false
      if (f.is_psplus && !game.is_psplus) return false

      return true
    })
  })

  return {
    games,
    searchTerm,
    filters,
    filteredGames,
    loadGames,
    getGameById,
    setSearchTerm,
    setFilters,
    clearFilters,
    addGame,
    updateGame,
  }
})
