import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/AcceuilView.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/categories/:categorie_id/books',
      name: 'bookByCategory',
      component: () => import('../views/BookByCategoryView.vue'),
    },
    {
      path: '/users/:userId',
      name: 'userById',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-books',
      name: 'myBooks',
      component: () => import('../views/MyBooksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/details/:id',
      name: 'Details',
      component: () => import('../views/DetailsView.vue'),
    },
    {
      path: '/create',
      name: 'Create',
      component: () => import('../views/CreateBookView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/edit/:id',
      name: 'EditBook',
      component: () => import('../views/EditBookView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/callback',
      name: 'LoginCallback',
      component: () => import('../views/LoginCallbackView.vue'),
    },
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || localStorage.getItem('ms_jwt')
  const userId = localStorage.getItem('CurrentUserId')

  if (to.meta.requiresAuth && (!token || !userId)) {
    next('/login')
  } else {
    next()
  }
})

export default router
