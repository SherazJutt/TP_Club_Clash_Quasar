import { nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()



const routes = [

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: () => {
      let token = localStorage.getItem('access_token')
      if (!token) {
        return '/auth'
      }
    },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/garage', component: () => import('pages/Garage.vue') },
      { path: '/profile', component: () => import('src/pages/Profile.vue') },
      { path: '/assignraces', component: () => import('src/pages/AssignRace.vue') },
      { path: '/test', component: () => import('pages/test.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/NoLayout.vue'),
    beforeEnter: () => {
      let token = localStorage.getItem('access_token')
      if (token) {
        return '/'
      }
    },
    children: [
      { path: '', component: () => import('../auth/login.vue') },
      { path: '/login', component: () => import('../auth/login.vue') },
      // { path: '/signup', component: () => import('../auth/signup.vue') },

    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },

]

export default routes
