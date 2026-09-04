import { connectDB } from './lib/db.js';
import Customer from './lib/models/Customer.js';
import Order from './lib/models/Order.js';
import { applyCors } from './lib/cors.js';
import { requireAuth } from './lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const customers = await Customer.find().sort({ name: 1 }).lean();

    const orderStats = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$customer', totalOrders: { $sum: 1 }, totalSpent: { $sum: '$paidPrice' }, lastOrder: { $max: '$deliveryDate' } } },
    ]);

    const statsMap = {};
    for (const s of orderStats) statsMap[s._id.toString()] = s;

    const result = customers.map((c) => ({
      ...c,
      totalOrders: statsMap[c._id.toString()]?.totalOrders || 0,
      totalSpent: statsMap[c._id.toString()]?.totalSpent || 0,
      lastOrder: statsMap[c._id.toString()]?.lastOrder || null,
    }));

    return res.status(200).json({ customers: result });
  }

  if (req.method === 'POST') {
    const customer = await Customer.create(req.body);
    return res.status(201).json({ customer });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
