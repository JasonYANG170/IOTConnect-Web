import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta:{title:"万物互联IOT在线控制台"},
      component: HomeView
    },
    {
      path: '/control',
      name: 'control',
      meta:{title:"Flowerpot控制中心"},
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ControlView.vue')
    },
    {
      path: '/update',
      name: 'update',
      meta:{title:"更新检查"},
      component: () => import('../views/UpdateView.vue')
    }, {
      path: '/aichat',
      name: 'aichat',
      meta:{title:"Flowerpot AI"},
      component: () => import('../views/AiChatView.vue')
    },
    {
      path: '/about',
      name: 'about',
      meta:{title:"About关于"},
      component: () => import('../views/AboutView.vue')
    },
  ]
})

export default router
