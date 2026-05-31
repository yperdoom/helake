import { connectDB } from './lib/db.js';
import Recipe from './lib/models/Recipe.js';
import Settings from './lib/models/Settings.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function calcCosts(recipe, defaultInfraPercentage, defaultMargin) {
  const ingredientCost = recipe.ingredients.reduce((sum, item) => {
    const cost = item.ingredient?.costPerUnit || 0;
    return sum + cost * item.quantity;
  }, 0);

  const infraPct = recipe.infraCostPercentage ?? defaultInfraPercentage;
  const infraCost = ingredientCost * (infraPct / 100);
  const totalCost = ingredientCost + infraCost + (recipe.laborCost || 0);
  const suggestedPrice = totalCost * (1 + defaultMargin / 100);
  const margin = recipe.sellingPrice > 0
    ? ((recipe.sellingPrice - totalCost) / recipe.sellingPrice) * 100
    : null;

  return { ingredientCost, infraCost, totalCost, suggestedPrice, margin };
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

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
