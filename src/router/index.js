import { createRouter, createWebHistory } from 'vue-router'
import Browse from '../views/Browse.vue'

const routes = [
  {
    path: '/',
    name: 'browse',
    component: Browse
  },
  {
    path: '/installed',
    name: 'installed',
    component: () => import(/* webpackChunkName: "about" */ '../views/Installed.vue')
  },
  {
    path: '/updates',
    name: 'updates',
    component: () => import(/* webpackChunkName: "about" */ '../views/Updates.vue')
  },
  {
    path: '/output',
    name: 'output',
    component: () => import(/* webpackChunkName: "about" */ '../views/CommandOutput.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
