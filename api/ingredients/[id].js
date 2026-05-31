import { connectDB } from '../lib/db.js';
import Ingredient from '../lib/models/Ingredient.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const ingredient = await Ingredient.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!ingredient) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ ingredient });
  }

  if (req.method === 'DELETE') {
    await Ingredient.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
