import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login/Login.vue';
import Setup from './pages/Setup/Setup.vue';
import Orders from './pages/Orders/Orders.vue';
import Dashboard from './pages/Dashboard/Dashboard.vue';
import Recipes from './pages/Recipes/Recipes.vue';
import Customers from './pages/Customers/Customers.vue';
import Ingredients from './pages/Ingredients/Ingredients.vue';
import Settings from './pages/Settings/Settings.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/setup', name: 'Setup', component: Setup },
  { path: '/home', name: 'Dashboard', component: Dashboard },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/recipes', name: 'Recipes', component: Recipes },
  { path: '/customers', name: 'Customers', component: Customers },
  { path: '/ingredients', name: 'Ingredients', component: Ingredients },
  { path: '/settings', name: 'Settings', component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
