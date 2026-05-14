import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/listing', component: () => import('../views/Products.vue') },
  { path: '/products/:id', component: () => import('../views/ProductDetail.vue') },
  { path: '/ProductDetail', component: () => import('../views/ProductDetail.vue') },
  { path: '/cart', component: () => import('../views/Cart.vue') },
  { path: '/checkout', component: () => import('../views/Checkout.vue') },
  { path: '/order-success', component: () => import('../views/OrderSuccess.vue') },
  { path: '/signin', component: () => import('../views/SignIn.vue') },
  { path: '/wishlist', component: () => import('../views/Wishlist.vue') },
  { path: '/become-seller', component: () => import('../views/BecomeSeller.vue') },
  { path: '/sell', component: () => import('../views/Sell.vue') },
  { path: '/notifications', component: () => import('../views/Notifications.vue') },
  { path: '/settings', component: () => import('../views/Settings.vue') },
  { path: '/admin', component: () => import('../views/admin/Login.vue') },
  {
    path: '/admin',
    component: () => import('../views/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'products', component: () => import('../views/admin/Products.vue') },
      { path: 'orders', component: () => import('../views/admin/Orders.vue') },
      { path: 'categories', component: () => import('../views/admin/Categories.vue') },
      { path: 'users', component: () => import('../views/admin/Users.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) next('/admin')
  else next()
})

export default router
