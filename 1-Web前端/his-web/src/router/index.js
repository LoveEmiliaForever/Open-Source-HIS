import { createRouter, createWebHashHistory } from 'vue-router'
import homeView from '../views/homeView.vue'
import loginView from '../views/loginView.vue'
import signUpView from '../views/signUpView.vue'

const routes = [
  {
    path: '/login',
    component: loginView,
    name: 'login'
  },
  {
    path: '/sign-up',
    component: signUpView,
    name: 'signUp'
  },
  {
    path: '/home',
    alias: '/',
    component: homeView,
    name: 'home'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
