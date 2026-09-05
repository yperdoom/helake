import { connectDB } from '../../_lib/db.js';
import Routine from '../../_lib/models/Routine.js';
import { applyCors } from '../../_lib/cors.js';
import { requireAuth } from '../../_lib/auth.js';
import { scopedFilter } from '../../_lib/ownership.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['PUT', 'DELETE'])) return;

  const auth = requireAuth(req, res);
  if (!auth) return;

  await connectDB();
  const { id } = req.query;
  const { user: _ignored, ...payload } = req.body || {};

  if (req.method === 'PUT') {
    const routine = await Routine.findOneAndUpdate(
      scopedFilter(auth, { _id: id }),
      payload,
      { new: true, runValidators: true },
    );
    if (!routine) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ routine });
  }

  if (req.method === 'DELETE') {
    const deleted = await Routine.findOneAndDelete(scopedFilter(auth, { _id: id }));
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
