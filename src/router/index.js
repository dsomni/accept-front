import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { api } from "boot/axios";

export default route(function ({store}) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })



  Router.beforeEach(async (to, from, next) => {

    const isAuthenticated = store.getters['users/isAuthenticated'];
    await store.dispatch('users/viewMe');
    if (isAuthenticated){
     await store.dispatch('users/refresh');
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters['users/isAuthenticated']) {
        next();
        return;
      }

      next({
        path: '/form/login',
        query: {
           nextUrl: to.fullPath,
        }
    });
    } else {
      next();
    }
  });

  return Router
})
