import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoadingView from '../views/LoadingView.vue'
import ResultView from '../views/ResultView.vue'
import ShareView from '../views/ShareView.vue'

const router = createRouter({
  history: createWebHistory('/bazi-fortune/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/loading',
      name: 'loading',
      component: LoadingView
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    },
    {
      path: '/share/:shareCode',
      name: 'share',
      component: ShareView
    }
  ]
})

export default router