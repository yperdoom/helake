import { connectDB } from '../../_lib/db.js';
import Exercise from '../../_lib/models/Exercise.js';
import { applyCors } from '../../_lib/cors.js';
import { requireAuth } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (applyCors(req, res, ['PUT', 'DELETE'])) return;

  if (!requireAuth(req, res)) return;

  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const exercise = await Exercise.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exercise) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ exercise });
  }

  if (req.method === 'DELETE') {
    const deleted = await Exercise.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
