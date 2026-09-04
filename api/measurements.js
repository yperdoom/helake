import { connectDB } from './lib/db.js';
import BodyMeasurement from './lib/models/BodyMeasurement.js';
import { applyCors } from './lib/cors.js';
import { requireAuth } from './lib/auth.js';
import { scopedFilter } from './lib/ownership.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectDB();

  if (req.method === 'GET') {
    const measurements = await BodyMeasurement.find(scopedFilter(auth))
      .sort({ date: -1 })
      .lean();
    return res.status(200).json({ measurements });
  }

  if (req.method === 'POST') {
    const { user: _ignored, ...payload } = req.body || {};
    const measurement = await BodyMeasurement.create({ ...payload, user: auth.userId });
    return res.status(201).json({ measurement });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
