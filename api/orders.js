import { connectDB } from './lib/db.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  if (req.method === 'GET') {
    // TODO: return Order.find()
    return res.status(200).json({ orders: [] });
  }

  if (req.method === 'POST') {
    // TODO: return Order.create(req.body)
    return res.status(201).json({ order: req.body });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
