import LoginRegPageLayout from 'layouts/LoginRegPageLayout/index.vue';
import EduLayout from 'layouts/EduLayout/index.vue';

import LogIn from 'src/pages/LogIn/index.vue';
import Registration from 'src/pages/Registration/index.vue';
import TestBack from 'src/pages/TestBack/index.vue';

import EduMain from 'src/pages/Edu/Main/index.vue';


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
    path: '/form',
    component: LoginRegPageLayout,
    children: [
      { path: 'login', component: LogIn},
      { path: 'registration', component: Registration},
    ]
  },

  {
    path: '/edu',
    component: EduLayout,
    meta:{requiresAuth: true},
    children: [
      { path: '', component: EduMain},
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
