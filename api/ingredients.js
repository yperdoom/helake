import { connectDB } from './lib/db.js';
import Ingredient from './lib/models/Ingredient.js';
import Order from './lib/models/Order.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

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
