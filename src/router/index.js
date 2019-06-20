import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '*',
      // 1. 本機
      redirect: '/homepage' // '/admin/dashBoard'
      // 2. server
      // redirect: '/AdminUI/admin/member'
    },
    {
      // 1. 本機
      path: '/login',
      // 2. server
      // path: '/AdminUI/login',
      name: 'login',
      component: () => import('@/pages/Login')
    },
    {
      path: '/',
      name: 'homepage',
      component: () => import('@/pages/Home'),
      redirect: '/search',
      children: [
        {
          path: 'search',
          name: 'search',
          meta: { requiresAuth: true }, // 是否要驗證
          component: () => import('@/pages/Search')
        },
        {
          path: 'member/:searchFields/:search',
          name: 'member',
          meta: { requiresAuth: true }, // 是否要驗證
          component: () => import('@/pages/Member'),
          redirect: 'member/:searchFields/:search',
          children: [
            {
              path: '',
              name: 'memAccountrecords',
              meta: { requiresAuth: true }, // 是否要驗證
              component: () => import('@/pages/MemAccountrecords')
            },
            {
              path: 'memTransactionrecords',
              name: 'memTransactionrecords',
              meta: { requiresAuth: true }, // 是否要驗證
              component: () => import('@/pages/MemTransactionrecords')
            },
            {
              path: 'memTicketholder',
              name: 'memTicketholder',
              meta: { requiresAuth: true }, // 是否要驗證
              component: () => import('@/pages/MemTicketholder')
            }
          ]
        }
      ]
    }
  ]
})
