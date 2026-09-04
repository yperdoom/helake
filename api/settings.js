import { connectDB } from './lib/db.js';
import Settings from './lib/models/Settings.js';
import { applyCors } from './lib/cors.js';
import { requireAuth } from './lib/auth.js';

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
