import { connectDB } from '../lib/db.js';
import Ingredient from '../lib/models/Ingredient.js';
import { applyCors } from '../lib/cors.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['PUT', 'DELETE'])) return;

  if (!requireAuth(req, res)) return;

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
