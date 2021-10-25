
const routes = [
  {
    path: '/',
    component: () => import('layouts/GlobalLayout/index.vue'),
    children: [
      { path: '', component: () => import('pages/index/Index.vue') }
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
