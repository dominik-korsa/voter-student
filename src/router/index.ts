import { createRouter, createWebHistory } from 'vue-router'
import CodeView from '../views/CodeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'code',
      component: CodeView,
    },
    {
      path: '/vote',
      name: 'vote',
      component: () => import('../views/VoteView.vue')
    },
  ]
})

export default router
