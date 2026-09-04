import { connectDB } from './lib/db.js';
import WorkoutLog from './lib/models/WorkoutLog.js';
import Routine from './lib/models/Routine.js';
import { applyCors } from './lib/cors.js';
import { requireAuth } from './lib/auth.js';
import { scopedFilter } from './lib/ownership.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectDB();

  if (req.method === 'GET') {
    const { exercise } = req.query;
    const filter = scopedFilter(auth, exercise ? { 'entries.exercise': exercise } : {});
    const logs = await WorkoutLog.find(filter)
      .populate('entries.exercise', 'name muscleGroup')
      .sort({ date: -1 })
      .lean();
    return res.status(200).json({ logs });
  }

  if (req.method === 'POST') {
    const { user: _ignored, ...payload } = req.body || {};

    if (payload.routine) {
      const owns = await Routine.exists(scopedFilter(auth, { _id: payload.routine }));
      if (!owns) return res.status(404).json({ error: 'Routine not found' });
    }

    const log = await WorkoutLog.create({ ...payload, user: auth.userId });
    return res.status(201).json({ log });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
