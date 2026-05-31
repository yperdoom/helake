import { connectDB } from './lib/db.js';
import Settings from './lib/models/Settings.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  if (req.method === 'GET') {
    const settings = await Settings.getOrCreate();
    return res.status(200).json({ settings });
  }

  if (req.method === 'PUT') {
    const settings = await Settings.findByIdAndUpdate('global', req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return res.status(200).json({ settings });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
