import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SearchResult from '@/views/SearchResult.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';
import EditMoviePage from '@/views/EditMoviePage.vue';
import { getRoleFromToken } from '@/utils/auth';
import ShowFilmPage from '@/views/ShowFilmPage.vue';
import EditUserPage from '@/views/EditUserPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/results',
    name: 'Results',
    component: SearchResult
  },
  {
    path: '/film/:id',
    name: 'Film',
    component: ShowFilmPage
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: EditMoviePage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/add',
    name: 'Add',
    component: EditMoviePage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/edit/:id',
    name: 'Edit User',
    component: EditUserPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/add',
    name: 'Add User',
    component: EditUserPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = getRoleFromToken();

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' });
  } else if (to.meta.requiresAdmin && role !== 'ADMIN') {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router
