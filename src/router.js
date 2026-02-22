import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login/Login.vue';
import Ingredients from './pages/Ingredients/Ingredients.vue';
import Orders from './pages/Orders/Orders.vue';
import Recipes from './pages/Recipes/Recipes.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/ingredients', name: 'Ingredients', component: Ingredients },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/recipes', name: 'Recipes', component: Recipes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
