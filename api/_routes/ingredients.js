import { connectDB } from '../_lib/db.js';
import Ingredient from '../_lib/models/Ingredient.js';
import Order from '../_lib/models/Order.js';
// Registered for populate() only: each Vercel function is bundled
// separately, so a ref whose model is never imported throws
// MissingSchemaError at query time.
import '../_lib/models/Recipe.js';
import { applyCors } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const ingredients = await Ingredient.find().sort({ name: 1 }).lean();

    const activeOrders = await Order.find({ status: { $in: ['new'] } })
      .populate({ path: 'recipe', populate: { path: 'ingredients.ingredient' } })
      .lean();

    const reserved = {};
    for (const order of activeOrders) {
      if (!order.recipe?.ingredients) continue;
      for (const item of order.recipe.ingredients) {
        const id = item.ingredient?._id?.toString();
        if (!id) continue;
        reserved[id] = (reserved[id] || 0) + item.quantity * order.quantity;
      }
    }

    const result = ingredients.map((ing) => ({
      ...ing,
      reserved: reserved[ing._id.toString()] || 0,
      projectedStock: ing.currentStock - (reserved[ing._id.toString()] || 0),
    }));

    return res.status(200).json({ ingredients: result });
  }

  if (req.method === 'POST') {
    const ingredient = await Ingredient.create(req.body);
    return res.status(201).json({ ingredient });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
