import dashboard from './_routes/dashboard.js';
import settings from './_routes/settings.js';
import customers from './_routes/customers.js';
import customerById from './_routes/customers/[id].js';
import exercises from './_routes/exercises.js';
import exerciseById from './_routes/exercises/[id].js';
import ingredients from './_routes/ingredients.js';
import ingredientById from './_routes/ingredients/[id].js';
import measurements from './_routes/measurements.js';
import measurementById from './_routes/measurements/[id].js';
import orders from './_routes/orders.js';
import orderById from './_routes/orders/[id].js';
import recipes from './_routes/recipes.js';
import recipeById from './_routes/recipes/[id].js';
import routines from './_routes/routines.js';
import routineById from './_routes/routines/[id].js';
import users from './_routes/users.js';
import userById from './_routes/users/[id].js';
import workoutLogs from './_routes/workout-logs.js';
import workoutLogById from './_routes/workout-logs/[id].js';
import authLogin from './_routes/auth/login.js';
import authSetup from './_routes/auth/setup.js';

// Single Vercel Function fanning out to every route: the Hobby plan caps
// deployments at 12 functions, so adding a route here means one more table
// entry, not one more function.
const LIST_ROUTES = {
  dashboard, settings, customers, exercises, ingredients, measurements,
  orders, recipes, routines, users, 'workout-logs': workoutLogs,
};

const ID_ROUTES = {
  customers: customerById, exercises: exerciseById, ingredients: ingredientById,
  measurements: measurementById, orders: orderById, recipes: recipeById,
  routines: routineById, users: userById, 'workout-logs': workoutLogById,
};

const FIXED_ROUTES = {
  'auth/login': authLogin,
  'auth/setup': authSetup,
};

export default async function handler(req, res) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : [path].filter(Boolean);

  if (segments.length === 1 && LIST_ROUTES[segments[0]]) {
    return LIST_ROUTES[segments[0]](req, res);
  }

  if (segments.length === 2 && ID_ROUTES[segments[0]]) {
    req.query.id = segments[1];
    return ID_ROUTES[segments[0]](req, res);
  }

  const fixedRoute = FIXED_ROUTES[segments.join('/')];
  if (fixedRoute) return fixedRoute(req, res);

  return res.status(404).json({ error: 'Not found' });
}
