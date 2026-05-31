import { connectDB } from '../lib/db.js';
import Order from '../lib/models/Order.js';
import Ingredient from '../lib/models/Ingredient.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function adjustStock(recipe, orderQty, direction) {
  if (!recipe?.ingredients) return;
  const ops = recipe.ingredients.map((item) =>
    Ingredient.findByIdAndUpdate(item.ingredient, {
      $inc: { currentStock: direction * item.quantity * orderQty },
    })
  );
  await Promise.all(ops);
}

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const current = await Order.findById(id).populate('recipe');
    if (!current) return res.status(404).json({ error: 'Not found' });

    const { status: newStatus } = req.body;

    if (newStatus && newStatus !== current.status) {
      if (newStatus === 'in_production' && current.status === 'new') {
        await adjustStock(current.recipe, current.quantity, -1);
      }
      if (newStatus === 'cancelled' && current.status === 'in_production') {
        await adjustStock(current.recipe, current.quantity, +1);
      }
    }

    const order = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('customer', 'name phone')
      .populate({ path: 'recipe', select: 'name category' });

    return res.status(200).json({ order });
  }

  if (req.method === 'DELETE') {
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
