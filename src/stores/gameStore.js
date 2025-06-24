import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import directus, { getCurrentUser } from '../api/cms' // Assicurati che questo import sia corretto
import { readItems, createItem, updateItem } from '@directus/sdk'

export const useGameStore = defineStore('gameStore', () => {
  const games = ref([])
  const searchTerm = ref('')
  const filters = ref({
    genre: '',
    console: '',
    completed: false,
    platinized: false,
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
        genre: game.genere,
        console: game.console,
        releaseDate: game.released_at,
        completedDate: game.completed_at,
        platinatedDate: game.platinated_at,
        developer: game.developer,
        description: game.description,
        completed: game.is_completed,
        platinized: game.is_platinated,
        psplus: game.is_psplus,
        digital: game.is_digital,
        ratings: game.rating || {},
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
          genere: newGame.genre,
          console: newGame.console,
          released_at: newGame.releaseYear,
          completed_at: newGame.completed ? new Date().toISOString() : null,
          platinated_at: newGame.platinized ? new Date().toISOString() : null,
          developer: newGame.softwareHouse,
          description: newGame.description,
          is_completed: newGame.completed,
          is_platinated: newGame.platinized,
          is_psplus: false, // eventualmente aggiornabile
          is_digital: false,
          rating: newGame.ratings,
          media: newGame.media,
          cover: newGame.coverImageUrl,
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
          genere: updatedGame.genre,
          console: updatedGame.console,
          released_at: updatedGame.releaseYear,
          completed_at: updatedGame.completed ? new Date().toISOString() : null,
          platinated_at: updatedGame.platinized ? new Date().toISOString() : null,
          developer: updatedGame.softwareHouse,
          description: updatedGame.description,
          is_completed: updatedGame.completed,
          is_platinated: updatedGame.platinized,
          rating: updatedGame.ratings,
          media: updatedGame.media,
          cover: updatedGame.coverImageUrl,
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
      genre: '',
      console: '',
      completed: false,
      platinized: false,
    }
  }

  const filteredGames = computed(() => {
    let filtered = games.value

    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      filtered = filtered.filter(
        game =>
          game.title.toLowerCase().includes(term) ||
          (game.genre || '').toLowerCase().includes(term) ||
          (game.console || '').toLowerCase().includes(term) ||
          (game.description || '').toLowerCase().includes(term) ||
          (game.developer || '').toLowerCase().includes(term)
      )
    }

    if (filters.value.genre) {
      filtered = filtered.filter(game => game.genre === filters.value.genre)
    }
    if (filters.value.console) {
      filtered = filtered.filter(game => game.console === filters.value.console)
    }
    if (filters.value.completed) {
      filtered = filtered.filter(game => game.completed)
    }
    if (filters.value.platinized) {
      filtered = filtered.filter(game => game.platinized)
    }

    return filtered
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
