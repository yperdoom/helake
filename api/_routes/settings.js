import { connectDB } from '../_lib/db.js';
import Settings from '../_lib/models/Settings.js';
import { applyCors } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'PUT'])) return;

  if (!requireAuth(req, res)) return;

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
