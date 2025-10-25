import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import directus from '../api/cms' // istanza già configurata

export const useUserStore = defineStore('userStore', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)

  // NUOVO: controllo scadenza token
  const expiry = localStorage.getItem('auth_token_expiry')

  if (token.value && expiry && Date.now() < parseInt(expiry)) {
    directus.auth.static(token.value)
    loadCurrentUser()
  } else {
    logout()
  }

  async function login(email, password) {
    try {
      const authResponse = await directus.auth.login({ email, password })
      token.value = authResponse.access_token
      localStorage.setItem('auth_token', token.value)

      // salva scadenza token
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000
      localStorage.setItem('auth_token_expiry', expiry)

      await loadCurrentUser()
    } catch (error) {
      console.error('Errore login:', error)
      throw error
    }
  }

  async function loadCurrentUser() {
    try {
      const me = await directus.users.me.read()
      user.value = me
    } catch (error) {
      console.error('Errore caricamento utente:', error)
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_token_expiry')
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, token, isAuthenticated, login, logout }
})

async function testLogin() {
  console.log('Directus instance:', directus)
  console.log('Directus auth:', directus.auth)

  if (!directus.auth || typeof directus.auth.login !== 'function') {
    console.error('directus.auth.login NON è definito')
    return
  }

  try {
    const response = await directus.auth.login('tuo_email@example.com', 'tua_password')
    console.log('Login OK:', response)
  } catch (e) {
    console.error('Errore durante il login:', e)
  }
}
testLogin()
