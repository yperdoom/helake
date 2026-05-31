import { connectDB } from '../lib/db.js';
import Recipe from '../lib/models/Recipe.js';

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
    const recipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ recipe });
  }

  if (req.method === 'DELETE') {
    await Recipe.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
