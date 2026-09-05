import { connectDB } from '../_lib/db.js';
import Recipe from '../_lib/models/Recipe.js';
import Settings from '../_lib/models/Settings.js';
// Registered for populate() only: each Vercel function is bundled
// separately, so a ref whose model is never imported throws
// MissingSchemaError at query time.
import '../_lib/models/Ingredient.js';
import { applyCors } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';
import { calcCosts } from '../_lib/recipeCosts.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const [recipes, settings] = await Promise.all([
      Recipe.find().populate('ingredients.ingredient').sort({ name: 1 }).lean(),
      Settings.getOrCreate(),
    ]);

    const result = recipes.map((r) => ({
      ...r,
      ...calcCosts(r, settings.defaultInfraPercentage, settings.defaultMargin),
    }));

    return res.status(200).json({ recipes: result });
  }

  if (req.method === 'POST') {
    const recipe = await Recipe.create(req.body);
    return res.status(201).json({ recipe });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
