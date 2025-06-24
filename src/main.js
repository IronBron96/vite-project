import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router' // <-- Importa il router
import './style.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(router) // <-- Usa il router
app.use(pinia)

app.mount('#app')
