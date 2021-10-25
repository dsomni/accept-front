
const routes = [
  {
    path: '/',
    component: () => import('layouts/GlobalLayout/index.vue'),
    children: [
      { path: '', component: () => import('src/pages/index/index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
