import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'PageMain',
    redirect: '/goods'
  },
  {
    path: '/goods',
    name: 'PageGoods',
    component: () => import(/* webpackChunkName: "pageGoods" */ '@/components/Goods/')
  },
  {
    path: '/ratings',
    name: 'PageRatings',
    component: () => import(/* webpackChunkName: "pageGoods" */ '@/components/RatingsPage/')
  },
  {
    path: '/sellers',
    name: 'PageSellers',
    component: () => import(/* webpackChunkName: "pageGoods" */ '@/components/Sellers/')
  }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

export default router
