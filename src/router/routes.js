import LogIn from 'src/pages/LogIn/index.vue';
import TestBack from 'src/pages/TestBack/index.vue';


const routes = [
  {
    path: '/',
    component: () => import('layouts/GlobalLayout/index.vue'),
    children: [
      { path: '', component: () => import('src/pages/Main/index.vue') },
      { path: 'about', component: () => import('src/pages/Main/index.vue') }
    ]
  },

  {
    path: '/log-in',
    component: LogIn
  },

  {
    path: '/test-back',
    component: TestBack
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/Error404/index.vue')
  }
]

export default routes
