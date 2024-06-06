import { createRouter, createWebHashHistory } from 'vue-router'
import CalendarView from '../views/CalendarView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: CalendarView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
