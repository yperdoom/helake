import { connectDB } from './lib/db.js';
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
