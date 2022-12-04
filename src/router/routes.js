
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/garage', component: () => import('pages/Garage.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/NoLayout.vue'),
    children: [
      { path: '', component: () => import('../auth/Login_signup.vue') },

    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
