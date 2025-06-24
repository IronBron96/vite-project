// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import GamePage from '@/views/GamePage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/game/:id', name: 'GamePage', component: GamePage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
