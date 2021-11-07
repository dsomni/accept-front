
const routes = [
  {
    path: '/',
    component: () => import('layouts/GlobalLayout/index.vue'),
    children: [
      { path: '', component: () => import('src/pages/Main/index.vue') },
      // { path: 'about', component: () => import('src/pages/Main/index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/Error404/index.vue')
  }
]

export default routes
