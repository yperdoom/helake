import { connectDB } from './lib/db.js';
import Recipe from './lib/models/Recipe.js';
import Settings from './lib/models/Settings.js';
import { applyCors } from './lib/cors.js';
import { requireAuth } from './lib/auth.js';
import { calcCosts } from './lib/recipeCosts.js';

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
