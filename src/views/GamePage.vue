<template>
  <div class="p-6">
    <!-- Visualizza il form di modifica se showEditForm è true, altrimenti visualizza i dettagli del gioco -->
    <GameForm v-if="showEditForm" :gameToEdit="gameToEdit" @game-saved="handleGameSaved" />
    <GameDetail v-else @edit-game="handleEditGame" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showEditForm = ref(false) // Controlla la visibilità del form di modifica
const gameToEdit = ref(null) // Contiene l'oggetto del gioco da passare al form

// Funzione chiamata quando GameDetail emette 'edit-game'
const handleEditGame = gameData => {
  gameToEdit.value = gameData // Imposta i dati del gioco da modificare
  showEditForm.value = true // Mostra il form di modifica
}

// Funzione chiamata quando GameForm emette 'game-saved'
const handleGameSaved = () => {
  showEditForm.value = false // Nasconde il form di modifica
  gameToEdit.value = null // Resetta i dati del gioco da modificare
}
</script>
