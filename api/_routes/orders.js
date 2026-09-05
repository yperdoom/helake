import { connectDB } from '../_lib/db.js';
import Order from '../_lib/models/Order.js';
// Registered for populate() only: each Vercel function is bundled
// separately, so a ref whose model is never imported throws
// MissingSchemaError at query time.
import '../_lib/models/Customer.js';
import '../_lib/models/Recipe.js';
import '../_lib/models/Ingredient.js';
import { applyCors } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const orders = await Order.find()
      .populate('customer', 'name phone')
      .populate({ path: 'recipe', populate: { path: 'ingredients.ingredient', select: 'name unit' } })
      .sort({ deliveryDate: 1 })
      .lean();
    return res.status(200).json({ orders });
  }

  if (req.method === 'POST') {
    const order = await Order.create(req.body);
    await order.populate(['customer', 'recipe']);
    return res.status(201).json({ order });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
