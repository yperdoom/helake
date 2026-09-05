import { connectDB } from '../_lib/db.js';
import Routine from '../_lib/models/Routine.js';
// Registered for populate() only: each Vercel function is bundled
// separately, so a ref whose model is never imported throws
// MissingSchemaError at query time.
import '../_lib/models/Exercise.js';
import { applyCors } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';
import { scopedFilter } from '../_lib/ownership.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['GET', 'POST'])) return;

  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectDB();

  if (req.method === 'GET') {
    const routines = await Routine.find(scopedFilter(auth))
      .populate('exercises.exercise', 'name muscleGroup')
      .sort({ name: 1 })
      .lean();
    return res.status(200).json({ routines });
  }

  if (req.method === 'POST') {
    const { user: _ignored, ...payload } = req.body || {};
    const routine = await Routine.create({ ...payload, user: auth.userId });
    return res.status(201).json({ routine });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
