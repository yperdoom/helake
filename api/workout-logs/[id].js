import { connectDB } from '../lib/db.js';
import WorkoutLog from '../lib/models/WorkoutLog.js';
import { applyCors } from '../lib/cors.js';
import { requireAuth } from '../lib/auth.js';
import { scopedFilter } from '../lib/ownership.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['PUT', 'DELETE'])) return;

  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectDB();
  const { id } = req.query;
  const { user: _ignored, ...payload } = req.body || {};

  if (req.method === 'PUT') {
    const log = await WorkoutLog.findOneAndUpdate(
      scopedFilter(auth, { _id: id }),
      payload,
      { new: true, runValidators: true },
    );
    if (!log) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ log });
  }

  if (req.method === 'DELETE') {
    const deleted = await WorkoutLog.findOneAndDelete(scopedFilter(auth, { _id: id }));
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
