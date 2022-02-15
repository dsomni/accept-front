import { paths } from './paths'

import LoginRegPageLayout from 'layouts/LoginRegPageLayout/index.vue';
import EduLayout from 'layouts/EduLayout/index.vue';

import LogIn from 'src/pages/LogIn/index.vue';
import Registration from 'src/pages/Registration/index.vue';
import TestBack from 'src/pages/TestBack/index.vue';

import EduTaskList from 'src/pages/Edu/TaskPages/TaskList/index.vue';
import EduAddTask from 'src/pages/Edu/TaskPages/AddTask/index.vue';
import EduEditTask from 'src/pages/Edu/TaskPages/EditTask/index.vue';
import EduTask from 'src/pages/Edu/TaskPages/Task/index.vue';

import EduAssignmentList from 'src/pages/Edu/AssignmentPages/AssignmentList/index.vue';


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainPageLayout/index.vue'),
    children: [
      { path: '', component: () => import('src/pages/Main/index.vue') },
      { path: paths.about, component: () => import('src/pages/Main/index.vue') },
    ]
  },

  {
    path: paths.form.self,
    component: LoginRegPageLayout,
    children: [
      { path: paths.form.login , component: LogIn },
      { path: paths.form.registration, component: Registration },
    ]
  },

  {
    path: paths.edu.self,
    component: EduLayout,
    meta: { requiresAuth: true },
    children: [
      { path: paths.edu.task.list, component: EduTaskList },
      { path: paths.edu.task.add, component: EduAddTask },
      { path: paths.edu.task.edit, component: EduEditTask, props: true },
      { path: paths.edu.task.page, component: EduTask, props: true },

      { path: paths.edu.assignment.list, component: EduAssignmentList },
      // { path: paths.edu.assignment.add, component: EduAddAssignment },
      // { path: paths.edu.assignment.edit, component: EduEditAssignment, props: true },
      // { path: paths.edu.assignment.page, component: EduAssignment, props: true }
    ]
  },

  {
    path: '/test-back',
    component: TestBack,
    meta: { requiresAuth: true },
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/Error404/index.vue')
  }
]

export default routes
