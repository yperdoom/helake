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
    return res.status(200).json({ ingredients: [] });
  }

  if (req.method === 'POST') {
    return res.status(201).json({ ingredient: req.body });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
