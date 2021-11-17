import LogIn from 'src/pages/LogIn/index.vue';
import LogInPageLayout from 'layouts/LogInPageLayout/index.vue';
import TestBack from 'src/pages/TestBack/index.vue';


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainPageLayout/index.vue'),
    children: [
      { path: '', component: () => import('src/pages/Main/index.vue') },
      { path: 'about', component: () => import('src/pages/Main/index.vue') },
    ]
  },

  {
    path: '/login',
    component: LogInPageLayout,
    children: [
      { path: '', component: LogIn},
    ]
  },

  {
    path: '/test-back',
    component: TestBack,
    meta:{requiresAuth: true},
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/Error404/index.vue')
  }
]


export default routes
