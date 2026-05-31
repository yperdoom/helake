import { connectDB } from './lib/db.js';
import Customer from './lib/models/Customer.js';
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
